import { addNewClass, removeClass, throttle } from './class-module'

var searchFunc = function (path, search_id, content_id) {
    $.ajax({
        url: path,
        dataType: 'xml',
        success: function (xmlResponse) {
            var datas = $('entry', xmlResponse)
                .map(function () {
                    return {
                        title: $('title', this).text(),
                        content: $('content', this).text(),
                        url: $('url', this).text(),
                    }
                })
                .get()

            var $input = document.getElementById(search_id)
            var $resultContent = document.getElementById(content_id)
            $input.addEventListener('input', function () {
							$('.search-result').slideDown()
                var str = ''
                var keywords = this.value
                    .trim()
                    .toLowerCase()
                    .split(/[\s-]+/)
                $resultContent.innerHTML = ''
                if (this.value.trim().length <= 0) {
                    return
                }
                datas.forEach(function (data) {
                    var isMatch = true
                    var content_index = []
                    if (!data.title || data.title.trim() === '') {
                        data.title = 'Untitled'
                    }
                    var data_title = data.title.trim().toLowerCase()
                    var data_content = data.content
                        .trim()
                        .replace(/<[^>]+>/g, '')
                        .toLowerCase()
                    var data_url = data.url
                    var index_title = -1
                    var index_content = -1
                    var first_occur = -1
                    if (data_content !== '') {
                        keywords.forEach(function (keyword, i) {
                            index_title = data_title.indexOf(keyword)
                            index_content = data_content.indexOf(keyword)

                            if (index_title < 0 && index_content < 0) {
                                isMatch = false
                            } else {
                                if (index_content < 0) {
                                    index_content = 0
                                }
                                if (i == 0) {
                                    first_occur = index_content
                                }
                            }
                        })
                    } else {
                        isMatch = false
                    }
                    if (isMatch) {
                        var content = data.content
                            .trim()
                            .replace(/<[^>]+>/g, '')
                        if (first_occur >= 0) {
                            var start = first_occur - 20
                            var end = first_occur + 80

                            if (start < 0) {
                                start = 0
                            }

                            if (start == 0) {
                                end = 100
                            }

                            if (end > content.length) {
                                end = content.length
                            }

                            var match_content = content.substr(start, end)
                            keywords.forEach(function (keyword) {
                                var regS = new RegExp(keyword, 'gi')
                                match_content = match_content.replace(
                                    regS,
                                    '<span class="search-result-keyword">' +
                                        keyword +
                                        '</span>'
                                )
                                data_title = data_title.replace(
                                    regS,
                                    '<span class="search-result-keyword">' +
                                        keyword +
                                        '</span>'
                                )
                            })
                            var title =
                                "<span class='search-result-item'>" +
                                "<h1><a href='" +
                                data_url +
                                "'>" +
                                data_title +
                                '</a></h1>'
							var date = data_url.substr(1,11)
                            str += title + '<p>' + match_content + '...</p>'+ '<p>' + date + '</p>'
                        }
                        str += '</span>'
                    }
                })
                if (str.indexOf('</a>') === -1) {
                    return ($resultContent.innerHTML =
                        "<p class='search-result-empty'>没有找到内容，更换下搜索词试试吧~</p>")
                }
                $resultContent.innerHTML = str
            })
        },
    })
    // $(document).on('click', '#local-search-close', function () {
    //     $('#local-search-input').val('')
    //     $('#local-search-result').html('')
    // })
    $('#search').on('focusin', () => {
        addNewClass($('.search'), 'search-focus')
    })
    $('#search').on('focusout', () => {
    		removeClass($('.search'), 'search-focus')
    		$('.search-result').slideUp()
    })
}

searchFunc('/search.xml', 'search', 'search-ps')
