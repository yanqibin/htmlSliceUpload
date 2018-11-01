//文件上传插件
(function (w, $) {
    $.fn.uploadFile = function (option) {
        option = $.extend({
            chunk: 1024 * 1024,
            url: '',
            process: function () {

            },
            error: function () {

            },
            success: function () {

            }
        }, option);


        var _total_page = 0;
        var _total_size = 0;
        var _upload_file = 0;
        var _uploaded_size = 0;
        var _uploaded_xhr = null;
        var _upload_tmp_path = '';

        function _init() {
            _total_page = 0;
            _total_size = 0;
            _uploaded_size = 0;
            _uploaded_xhr = null;
            _upload_tmp_path = '';
        }

        function _start_upload() {
            var files = $(option.file).get(0).files;
            if (undefined == files || undefined == files[0]) {
                alert('请先上传图片');
                return false;
            }
            _init();
            _upload_file = files[0];
            _total_size = _upload_file.size;
            _total_page = Math.ceil(_upload_file.size / option.chunk);

            _slice_upload(1);
        }

        function _slice_upload(page) {

            var form_data = new FormData();
            form_data.append('page', page);
            form_data.append('tmp_path', _upload_tmp_path);
            form_data.append('total_page', _total_page);
            form_data.append('file_name', _upload_file.name);
            form_data.append('file', _upload_file.slice(option.chunk * (page - 1), option.chunk * (page)));

            $.ajax({
                url: option.url,
                type: 'POST',
                dateType: 'json',
                xhr: function () {  // custom xhr

                    var xhr = $.ajaxSettings.xhr();

                    if (xhr.upload) { // check if upload property exists
                        xhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                option.process(_uploaded_size + e.loaded, _total_size);
                            }

                        }, false); // for handling the progress of the upload
                    }
                    _uploaded_xhr = xhr;
                    return xhr;
                },
                success: function (data) {

                    if ('success' == data.status) {
                        if (page >= _total_page) {
                            option.success(data)
                        } else {
                            _upload_tmp_path = data.data.tmp_path;
                            _slice_upload(++page);
                        }
                    } else {
                        option.error(data)
                    }


                },
                error: function () {
                    option.error()
                },
                data: form_data,
                cache: false,
                contentType: false,
                processData: false
            });


        }


        return this.click(_start_upload)

    }


})(window, jQuery);