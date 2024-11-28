import React, { useRef, useState } from 'react'
import { fileService } from '../../services/fileService';

const FileDownload = ({ file }) => {
    const ref = useRef();
    const [pointer, setPointer] = useState(false)

    const handleDownload2 = async (dest, item) => {
        const url = await fileService.getDownloadLink(dest, item);

        const link = ref.current;
        link.href = url;
        link.download = item.name; // Имя файла при скачивании
        link.click();
    }

    return (
        <a ref={ref} className='svg-wrapper' onMouseEnter={() => setPointer(!pointer)} onMouseLeave={() => setPointer(!pointer)}>
            <svg onClick={(e) => { e.preventDefault(); handleDownload2('files', file) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-inner">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            {pointer && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-innerD">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>}
        </a>
    )
}

export default FileDownload
