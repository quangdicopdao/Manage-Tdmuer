import classNames from 'classnames/bind';
import style from './ImageUploader.module.scss';
import { useState } from 'react';
import { Image } from 'cloudinary-react';

const cx = classNames.bind(style);

function ImageUploader() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    console.log(process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    console.log(process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    const uploadImage = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
        data.append('folder', 'Cloudinary-React');

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: data,
                },
            );
            const res = await response.json();
            setUrl(res.public_id);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            setPreview(reader.result);
        };
    };

    const handleResetClick = () => {
        setPreview(null);
        setImage(null);
        setUrl('');
    };

    return (
        <div className={cx('wrapper')}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className={cx('wrapper-preview')}>
                {preview && <img src={preview} alt="preview" className={cx('img-preview')} />}
            </div>
            <button onClick={uploadImage} disabled={!image}>
                Upload Now
            </button>
            <button onClick={handleResetClick} disabled={!image}>
                Reset
            </button>
            {url && !loading && (
                <div>
                    <Image cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME} publicId={url} />
                </div>
            )}
        </div>
    );
}

export default ImageUploader;
