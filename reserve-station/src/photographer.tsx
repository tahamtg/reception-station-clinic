import axios from "axios";
import { useState, useEffect } from "react";
import "./photographer.css";

interface Person {
    id: number;
    name: string;
    age: number;
    phone: string;
    file: number | null;
    address: string | null;
    reserve_date: string;
    services: string | null;
    price: number | null;
}

interface ImageUrl {
    person: number;
    img_before: string | null;
    img_after: string | null;
}

const PhotoGraph = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [imageUrl, setImageUrl] = useState<ImageUrl[]>([]);

    const [openImg, setOpenImg] = useState<{
        personId: number;
        type: "after" | "before";
    } | null>(null);

    const getPeople = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/get_submit_info/"
            );

            setPeople(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPeople();
    }, []);

    const get_photo = async (personId: number) => {
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/get_Photos/${personId}/`
            );

            const photos: ImageUrl[] = res.data;

            setImageUrl(prev => {
                const otherPeople = prev.filter(
                    item => Number(item.person) !== personId
                );

                const personPhotos = photos.map(item => ({
                    ...item,
                    person: Number(item.person)
                }));

                return [...otherPeople, ...personPhotos];
            });

        } catch (error: any) {
            if (error.response?.status === 404) {
                setImageUrl(prev =>
                    prev.filter(
                        item => Number(item.person) !== personId
                    )
                );

                return;
            }

            console.log(error);
        }
    };

    useEffect(() => {
        people.forEach(person => {
            get_photo(person.id);
        });
    }, [people]);

    const Upload = async (
        file: File,
        type: "img_before" | "img_after",
        personId: number
    ) => {
        const formData = new FormData();

        formData.append(type, file);

        try {
            await axios.post(
                `http://127.0.0.1:8000/api/post_image/${personId}/`,
                formData
            );

            await get_photo(personId);

        } catch (error) {
            console.log(error);
        }
    };

    const delPhoto = async (
        personId: number,
        photo: "before" | "after"
    ) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/delete_photo/${personId}/${photo}/`
            );

            await get_photo(personId);

            setOpenImg(null);

        } catch (error) {
            console.log(error);
        }
    };

    const update_photo = async (
        file: File,
        personId: number,
        photo: "before" | "after"
    ) => {
        const formData = new FormData();

        if (photo === "before") {
            formData.append("img_before", file);
        }

        if (photo === "after") {
            formData.append("img_after", file);
        }

        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/patch_photo/${personId}/${photo}/`,
                formData
            );

            await get_photo(personId);

            setOpenImg(null);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="people-table">
            <table>
                <thead>
                    <tr>
                        <th>شماره</th>
                        <th>نام</th>
                        <th>سن</th>
                        <th>شماره تماس</th>
                        <th>پرونده</th>
                        <th>خدمات</th>
                        <th>تاریخ رزرو</th>
                        <th>عکس قبل</th>
                        <th>عکس بعد</th>
                    </tr>
                </thead>

                <tbody>
                    {people.map(person => {

                        const personPhotos = imageUrl.filter(
                            item => Number(item.person) === person.id
                        );

                        const beforePhoto = [...personPhotos]
                            .reverse()
                            .find(item => item.img_before)?.img_before;

                        const afterPhoto = [...personPhotos]
                            .reverse()
                            .find(item => item.img_after)?.img_after;

                        return (
                            <tr key={person.id}>

                                <td>
                                    {person.id}
                                </td>

                                <td>
                                    {person.name}
                                </td>

                                <td>
                                    {person.age}
                                </td>

                                <td>
                                    {person.phone}
                                </td>

                                <td>
                                    {person.file}
                                </td>

                                <td>
                                    {person.services}
                                </td>

                                <td>
                                    {person.reserve_date}
                                </td>

                                <td>
                                    {beforePhoto ? (
                                        <div className="update-img">

                                            <label className="label-update-img">
                                                <img
                                                    onClick={() =>
                                                        setOpenImg({
                                                            personId: person.id,
                                                            type: "before"
                                                        })
                                                    }
                                                    src={`http://127.0.0.1:8000${beforePhoto}`}
                                                    alt="عکس قبل"
                                                />
                                            </label>

                                            {openImg?.personId === person.id &&
                                                openImg.type === "before" && (

                                                    <div
                                                        className="popupIMG"
                                                        onClick={() =>
                                                            setOpenImg(null)
                                                        }
                                                    >
                                                        <section
                                                            className="editBox"
                                                            onClick={e =>
                                                                e.stopPropagation()
                                                            }
                                                        >

                                                            <img
                                                                className="fullIMG"
                                                                src={`http://127.0.0.1:8000${beforePhoto}`}
                                                                alt="عکس قبل"
                                                            />

                                                            <div className="buttons">

                                                                <label className="edit-button">
                                                                    ویرایش عکس

                                                                    <input
                                                                        hidden
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={e => {
                                                                            const file =
                                                                                e.target.files?.[0];

                                                                            if (!file) {
                                                                                return;
                                                                            }

                                                                            update_photo(
                                                                                file,
                                                                                person.id,
                                                                                "before"
                                                                            );
                                                                        }}
                                                                    />
                                                                </label>

                                                                <button
                                                                    className="del-button"
                                                                    onClick={() =>
                                                                        delPhoto(
                                                                            person.id,
                                                                            "before"
                                                                        )
                                                                    }
                                                                >
                                                                    حذف عکس
                                                                </button>

                                                            </div>

                                                        </section>
                                                    </div>
                                                )}

                                        </div>
                                    ) : (

                                        <label className="photo-button">
                                            عکس قبل

                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={async e => {

                                                    const file =
                                                        e.target.files?.[0];

                                                    if (!file) {
                                                        return;
                                                    }

                                                    await Upload(
                                                        file,
                                                        "img_before",
                                                        person.id
                                                    );

                                                }}
                                            />
                                        </label>

                                    )}
                                </td>

                                <td>
                                    {afterPhoto ? (
                                        <div className="update-img">

                                            <label className="label-update-img">
                                                <img
                                                    onClick={() =>
                                                        setOpenImg({
                                                            personId: person.id,
                                                            type: "after"
                                                        })
                                                    }
                                                    src={`http://127.0.0.1:8000${afterPhoto}`}
                                                    alt="عکس بعد"
                                                />
                                            </label>

                                            {openImg?.personId === person.id &&
                                                openImg.type === "after" && (

                                                    <div
                                                        className="popupIMG"
                                                        onClick={() =>
                                                            setOpenImg(null)
                                                        }
                                                    >
                                                        <section
                                                            className="editBox"
                                                            onClick={e =>
                                                                e.stopPropagation()
                                                            }
                                                        >

                                                            <img
                                                                className="fullIMG"
                                                                src={`http://127.0.0.1:8000${afterPhoto}`}
                                                                alt="عکس بعد"
                                                            />

                                                            <div className="buttons">

                                                                <label className="edit-button">
                                                                    ویرایش عکس

                                                                    <input
                                                                        hidden
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={e => {

                                                                            const file =
                                                                                e.target.files?.[0];

                                                                            if (!file) {
                                                                                return;
                                                                            }

                                                                            update_photo(
                                                                                file,
                                                                                person.id,
                                                                                "after"
                                                                            );

                                                                        }}
                                                                    />
                                                                </label>

                                                                <button
                                                                    className="del-button"
                                                                    onClick={() =>
                                                                        delPhoto(
                                                                            person.id,
                                                                            "after"
                                                                        )
                                                                    }
                                                                >
                                                                    حذف عکس
                                                                </button>

                                                            </div>

                                                        </section>
                                                    </div>
                                                )}

                                        </div>
                                    ) : (

                                        <label className="photo-button">
                                            عکس بعد

                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={async e => {

                                                    const file =
                                                        e.target.files?.[0];

                                                    if (!file) {
                                                        return;
                                                    }

                                                    await Upload(
                                                        file,
                                                        "img_after",
                                                        person.id
                                                    );

                                                }}
                                            />
                                        </label>

                                    )}
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PhotoGraph;
