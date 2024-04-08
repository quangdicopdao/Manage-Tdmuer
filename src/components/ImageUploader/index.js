import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './ImageUploader.module.scss';
import { Image } from 'cloudinary-react';

const cx = classNames.bind(style);

function ImageUploader({ imageUrl }) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);

    const uploadImage = async () => {
        setLoading(true);
        
        // Reset progress to 0
        setProgress(0);

        // Calculate progress every 100 milliseconds
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + 1;
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, 30);

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
            console.log('res', res);
            setUrl(res.public_id);
            imageUrl(res.url);
            setLoading(false);
            clearInterval(interval); // Clear interval when upload is complete
            setProgress(100); // Set progress to 100%
        } catch (error) {
            setLoading(false);
            clearInterval(interval); // Clear interval on error
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
        setProgress(0); // Reset progress when reset button is clicked
    };

    useEffect(() => {
        if (image) {
            uploadImage();
        }
    }, [image]);

    return (
        <div className={cx('wrapper')}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
           
            {url && !loading && (
                <div className={cx('wrap-img-cloudinary')}>
                    <Image cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME} publicId={url} className={cx('img-cloudinary')} />
                </div>
            )}

            {progress !== 100 && (
                <div className={cx('progress-bar')}>
                    <div className={cx('progress-bar-inner')} style={{ width: `${progress}%` }}>
                        <div className={cx('progress-percent')}>{progress}%</div>
                    </div>
                </div>
            )}

            <button onClick={handleResetClick} disabled={!image}>
                Reset
            </button>
        </div>
    );
}

export default ImageUploader;
