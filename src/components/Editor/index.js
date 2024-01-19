import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import ImageUploader from 'quill-image-uploader';

Quill.register('modules/imageUploader', ImageUploader);

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'blockquote', 'code-block'],
        ],

        imageUploader: {
            upload: async (file) => {
                try {
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(
                        'https://api.imgbb.com/1/upload?key=c699e21fad5c4d215a1504e35ba7f9f5',
                        {
                            method: 'POST',
                            body: formData,
                        },
                    );

                    const result = await response.json();
                    console.log(result);

                    // Cập nhật trạng thái với HTML mới chứa ảnh
                    this.setState((prevState) => ({
                        text: prevState.text + `<img src="${result.data.url}" alt="uploaded image"  />`,
                    }));

                    return result.data.url;
                } catch (error) {
                    console.error('Error:', error);
                    throw new Error('Upload failed');
                }
            },
        },
    };
    formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'imageBlot',
    ];

    render() {
        return (
            <ReactQuill
                theme="snow"
                modules={this.modules}
                formats={this.formats}
                value={this.props.value}
                onChange={(value) => this.props.onChange(value)}
            />
        );
    }
}

export default Editor;
