import React, { useRef } from 'react'

const ImageDownload = ({ image }) => {
    const ref = useRef();

    const handleDownload = async (lin) => {
        try {
            const response = await fetch(lin);
            if (!response.ok) throw new Error("Ошибка загрузки файла");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = ref.current;
            link.href = url;
            link.download = "11-2.jpg"; // Имя файла при скачивании
            link.click();

            URL.revokeObjectURL(url); // Освобождаем память
        } catch (error) {
            console.error("Ошибка при скачивании файла:", error);
        }
    }

    return (
        <div className="photoItem">
            <div className="photoDetail">
                <img src={image} alt="" />
                <span>asdadjhkasjkd.png</span>
            </div>
            <a ref={ref}>
                <img onClick={() => handleDownload(image)} className='download' src="./download.png" alt="Download icon" />
            </a>
        </div>
    )
}

export default ImageDownload
