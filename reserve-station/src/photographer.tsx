import axios from "axios";
import { useState, useEffect } from "react";
import "./photographer.css";
import { useNavigate } from "react-router-dom";
import { number } from "yup";

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

interface imageUrl {
    person: number;
    img_before: string;
    img_after:  string;
}

const PhotoGraph = () => {

    const [people, setPeople] = useState<Person[]>([]);
    const [imageUrl, setImageUrl] = useState<imageUrl[]>([])
    const [openImg, setOpenImg] = useState<{
        personId: number,
        type: "after" | "before"
    } | null>(null)

    const [upImg, setUpImg] = useState({})

    const navigate = useNavigate()

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

    const Upload = async (
        file: File,
        type: "img_before" | "img_after",
        personId: number
    ) => {

        const formData = new FormData();

        formData.append(
            type,
            file
        );

        try {

            const req = await axios.post(
                `http://127.0.0.1:8000/api/post_image/${personId}/`,
                formData
            );

            console.log(req.data);

        } catch (error) {

            console.log(error);

        }

    };

        const get_photo = async (personId: number) => {

            try {

                const res = await axios.get(
                    `http://127.0.0.1:8000/api/get_Photos/${personId}/`
                );

               setImageUrl(prev => {
                const exists = prev.some(
                    item => item.person === res.data.person
                );

                if (exists) {
                    return prev.map(item =>
                        item.person === res.data.person
                            ? res.data
                            : item
                    );
                }

                return [...prev, res.data];
                
            });
            
                console.log(res.data)

            } catch (error) {

                console.log(error);

            }
            
        };

        useEffect(() => {

            people.forEach((person) => {
                get_photo(person.id);
            });

        }, [people]);


        const delPhoto = async (person:number, photo: string)=>{

            try{
                const rm = await axios.delete(`http://127.0.0.1:8000/api/delete_photo/${person}/${photo}/`)
            }catch(e:any){
                console.log(e)
            }

            const personphoto = people.find((item)=>{
                return item.id === person
            })

            if (!personphoto){return;}

            setImageUrl((prev) =>
                prev.map((item) => {

                    if (item.person !== person) {
                        return item;
                    }

                    if (photo === "before") {
                        return {
                            ...item,
                            img_before: "",
                        };
                    }

                    if (photo === "after") {
                        return {
                            ...item,
                            img_after: "",
                        };
                    }

                    return item;
                })
            );
        };

        const update_photo = async (file: File, person: number, photo: "before" | "after") => {

            const formData = new FormData();

            if (photo === "before") {
                formData.append("img_before", file);
            }

            if (photo === "after") {
                formData.append("img_after", file);
            }

            try {

                await axios.patch(
                    `http://127.0.0.1:8000/api/patch_photo/${person}/${photo}/`,
                    formData
                );

                await get_photo(person);

                setOpenImg(null);

            } catch (e) {

                console.log(e);

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

                  
                    {people.map((person) => {

                        const photo = imageUrl.find(
                            (item) => item.person === person.id
                        );

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

                                    {photo?.img_before ? (

                                        <div className="update-img">

                                            <label className="label-update-img">

                                                <img
                                                    onClick={() =>
                                                        setOpenImg({
                                                            personId: person.id,
                                                            type: "before"
                                                        })
                                                    }
                                                    src={`http://127.0.0.1:8000${photo.img_before}`}
                                                    alt="عکس قبل"
                                                />

                                            </label>

                                            {openImg?.personId === person.id &&
                                                openImg.type === "before" && (

                                                <div
                                                    className="popupIMG"
                                                    onClick={() => setOpenImg(null)}
                                                >

                                                    <section className="editBox">

                                                        <img
                                                            className="fullIMG"
                                                            src={`http://127.0.0.1:8000${photo.img_before}`}
                                                            alt="عکس قبل"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        />

                                                        <div className="buttons">

                                                            <button className="edit-button">
                                                                ویرایش عکس
                                                            </button>

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
                                                onChange={async (e) => {

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

                                                    await get_photo(person.id);

                                                }}
                                            />

                                        </label>

                                    )}

                                </td>

                                <td>

                                    {photo?.img_after ? (

                                       <div className="update-img">

                                        <label className="label-update-img">

                                            <img
                                                onClick={()=> setOpenImg({personId: person.id, type: "after"})}
                                                src={`http://127.0.0.1:8000${photo.img_after}`}
                                                alt="عکس بعد"
                                            />

                                        </label>

                                        {openImg?.personId === person.id && openImg.type === "after" && (

                                            <div
                                                className="popupIMG"
                                                onClick={() => setOpenImg(null)}
                                            >

                                                <section className="editBox">

                                                    <img
                                                    className="fullIMG"
                                                    src={`http://127.0.0.1:8000${photo.img_after}`}
                                                    alt="عکس بعد"
                                                    onClick={(e) => e.stopPropagation()}
                                                    />

                                                    <div className="buttons">
                                                        <label className="edit-button">

                                                            ویرایش عکس

                                                            <input
                                                                hidden
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {

                                                                    const file = e.target.files?.[0];

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

                                                        <button className="del-button" onClick={()=> delPhoto(person.id, "after")}>حذف عکس</button>
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
                                                onChange={async (e) => {

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

                                                    await get_photo(person.id)

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