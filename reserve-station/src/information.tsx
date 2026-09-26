import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./personInfo.css";

interface Person {
    id: number;
    name: string;
    age: number;
    phone: string;
    file: number | null;
    address: string | null;
    reserve_date: string;
    date: string | null;
    services: string | null;
    price: number | null;
}

interface Photos {
    person: number;
    img_before: string | null;
    img_after: string | null;
}

const API = "http://127.0.0.1:8000";

const PersonInfo: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const [person, setPerson] = useState<Person | null>(null);
    const [photos, setPhotos] = useState<Photos[]>([]);

    const [loading, setLoading] = useState(true);
    const [photosLoading, setPhotosLoading] = useState(true);

    const [openGallery, setOpenGallery] = useState(false);
    const [addPhoto, setAddPhoto] = useState(false);
    const [uploading, setUploading] = useState(false);


    const getPerson = async () => {

        try {

            const res = await axios.get(
                `${API}/api/get_submit_info/`
            );

            const selectedPerson = res.data.find(
                (item: Person) => item.id === Number(id)
            );

            setPerson(selectedPerson || null);

        } catch (error) {

            console.log(error);
            setPerson(null);

        } finally {

            setLoading(false);

        }
    };


    const getPhotos = async () => {

        if (!id) {
            return;
        }

        try {

            setPhotosLoading(true);

            const res = await axios.get(
                `${API}/api/get_Photos/${id}/`
            );

            setPhotos(res.data);

        } catch (error) {

            console.log(error);
            setPhotos([]);

        } finally {

            setPhotosLoading(false);

        }
    };


    useEffect(() => {

        getPerson();

    }, [id]);


    useEffect(() => {

        getPhotos();

    }, [id]);


    const Upload = async (
        file: File,
        type: "img_before" | "img_after",
        personId: number
    ) => {

        const formData = new FormData();

        formData.append(type, file);

        try {

            setUploading(true);

            await axios.post(
                `${API}/api/post_image/${personId}/`,
                formData
            );

            await getPhotos();

        } catch (error) {

            console.log(error);

        } finally {

            setUploading(false);

        }
    };


    const handleUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "img_before" | "img_after"
    ) => {

        const file = e.target.files?.[0];

        if (!file || !id) {
            return;
        }

        Upload(
            file,
            type,
            Number(id)
        );

        e.target.value = "";

    };


    if (loading) {

        return (
            <div className="person-page">

                <div className="person-card">

                    <h2>
                        در حال دریافت اطلاعات...
                    </h2>

                </div>

            </div>
        );

    }


    if (!person) {

        return (
            <div className="person-page">

                <div className="person-card">

                    <h2>
                        مراجعه‌کننده پیدا نشد
                    </h2>

                    <p>
                        اطلاعات این مراجعه‌کننده در سیستم وجود ندارد.
                    </p>

                </div>

            </div>
        );

    }

    return (

        <div className="person-page">

            <div className="person-header">

                <div>

                    <span className="person-label">
                        اطلاعات مراجعه‌کننده
                    </span>

                    <h1>
                        {person.name}
                    </h1>

                    <p>
                        شناسه مراجعه‌کننده: #{person.id}
                    </p>

                </div>

                <div className="person-avatar">
                    {person.name.charAt(0)}
                </div>

            </div>


            <div className="person-grid">

                <div className="info-box">
                    <span>نام و نام خانوادگی</span>
                    <strong>{person.name}</strong>
                </div>

                <div className="info-box">
                    <span>سن</span>
                    <strong>{person.age} سال</strong>
                </div>

                <div className="info-box">
                    <span>شماره تماس</span>
                    <strong>{person.phone}</strong>
                </div>

                <div className="info-box">
                    <span>پرونده</span>
                    <strong>
                        {person.file || "ثبت نشده"}
                    </strong>
                </div>

                <div className="info-box">
                    <span>آدرس</span>
                    <strong>
                        {person.address || "ثبت نشده"}
                    </strong>
                </div>

                <div className="info-box">
                    <span>تاریخ رزرو</span>
                    <strong>
                        {person.reserve_date}
                    </strong>
                </div>

                <div className="info-box">
                    <span>تاریخ ثبت</span>
                    <strong>
                        {person.date || "ثبت نشده"}
                    </strong>
                </div>

                <div className="info-box">
                    <span>بیعانه</span>
                    <strong>
                        {person.price?.toLocaleString("en-US") || "ثبت نشده"}
                    </strong>
                </div>

                <div className="info-box">
                    <span>خدمات</span>
                    <strong>
                        {person.services || "خدمتی ثبت نشده"}
                    </strong>
                </div>

            </div>


            <div className="person-gallery">

                <div className="gallery-title">

                    <h2>
                        گالری تصاویر
                    </h2>

                    <span>
                        تصاویر قبل و بعد
                    </span>

                </div>


                <div className="gallery-content">

                    {photos.map((photo, index) => (

                        <React.Fragment key={index}>

                            {photo.img_before && (
                                <img
                                    className="gallery-img before-img"
                                    src={`${API}${photo.img_before}`}
                                    alt="عکس قبل"
                                />
                            )}

                            {photo.img_after && (
                                <img
                                    className="gallery-img after-img"
                                    src={`${API}${photo.img_after}`}
                                    alt="عکس بعد"
                                />
                            )}

                        </React.Fragment>

                    ))}

                </div>


                <button
                    type="button"
                    onClick={() => setOpenGallery(true)}
                >
                    مشاهده گالری
                </button>


                {openGallery && (

                    <div className="gallery">

                        <div className="gallery-container">

                 
                            <div className="photosafterbefore">

                                <div className="images before-images">

                                    <h3>عکس‌های قبل</h3>

                                    {photos.some(
                                        (photo) => photo.img_before
                                    ) ? (

                                        photos
                                            .filter(
                                                (photo) => photo.img_before
                                            )
                                            .map((photo, index) => (

                                                <img
                                                    key={index}
                                                    src={`${API}${photo.img_before}`}
                                                    alt="عکس قبل"
                                                />

                                            ))

                                    ) : (

                                        <div className="empty-image">
                                            عکس قبل ثبت نشده
                                        </div>

                                    )}

                                </div>


                                <div className="images after-images">

                                    <h3>عکس‌های بعد</h3>

                                    {photos.some(
                                        (photo) => photo.img_after
                                    ) ? (

                                        photos
                                            .filter(
                                                (photo) => photo.img_after
                                            )
                                            .map((photo, index) => (

                                                <img
                                                    key={index}
                                                    src={`${API}${photo.img_after}`}
                                                    alt="عکس بعد"
                                                />

                                            ))

                                    ) : (

                                        <div className="empty-image">
                                            عکس بعد ثبت نشده
                                        </div>

                                    )}

                                </div>

                            </div>

                            {addPhoto && (

                                <div className="upload-images">

                                    <div className="imgbefore">

                                        <label htmlFor="before-image">

                                            <span>+</span>

                                            <small>
                                                افزودن عکس قبل
                                            </small>

                                            <input
                                                type="file"
                                                hidden
                                                id="before-image"
                                                accept="image/*"
                                                disabled={uploading}
                                                onChange={(e) =>
                                                    handleUpload(
                                                        e,
                                                        "img_before"
                                                    )
                                                }
                                            />

                                        </label>

                                    </div>


                                    <div className="imgafter">

                                        <label htmlFor="after-image">

                                            <span>+</span>

                                            <small>
                                                افزودن عکس بعد
                                            </small>

                                            <input
                                                type="file"
                                                hidden
                                                id="after-image"
                                                accept="image/*"
                                                disabled={uploading}
                                                onChange={(e) =>
                                                    handleUpload(
                                                        e,
                                                        "img_after"
                                                    )
                                                }
                                            />

                                        </label>

                                    </div>

                                </div>

                            )}


                            {!addPhoto && (

                                <button
                                    type="button"
                                    onClick={() => setAddPhoto(true)}
                                >
                                    + افزودن عکس
                                </button>

                            )}


                            <button
                                type="button"
                                onClick={() => {
                                    setOpenGallery(false);
                                    setAddPhoto(false);
                                }}
                            >
                                بستن
                            </button>

                        </div>

                    </div>

                )}

            </div>


            <div className="person-actions">

                <button className="edit-btn">
                    ویرایش اطلاعات
                </button>

                <button
                    className="back-btn"
                    onClick={() => window.history.back()}
                >
                    بازگشت
                </button>

            </div>

        </div>

    );

};


export default PersonInfo;
