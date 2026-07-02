"use client"
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from 'react';
import { ContentstackClient } from '@/lib/contentstack-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faTrash, faPlus, faCheck } from "@awesome.me/kit-610837e1f9/icons/classic/solid";
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { setPersonalizeLiveAttributesCookie } from '@/lib/cspersonalize';

export default function Profiles({ }) {
    const [profiles, setProfiles] = useState([]);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [audiences, setAudiences] = useState([]);
    const [saving, setSaving] = useState(-1);
    const [deleting, setDeleting] = useState(-1);
    const params = useParams();


    const getUser = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setAuthLoading(false);
        return user;
    }

    const getAudiences = async () => {
        const entry = await ContentstackClient.getElementByType("config", "en");
        setAudiences(entry?.[0]?.audience ?? []);
    }

    const getProfiles = async (user_id) => {
        let result = await fetch(`/api/profiles/${user_id}`, {
            method: 'GET',
        })
            .then((response) => {
                if (response.ok)
                    return response.json();
                else
                    return Promise.reject(response);
            })
            .then((result) => {
                let tempProfiles = [];
                for(const profile of result.profiles){
                    tempProfiles.push({
                        fname: profile?.first_name,
                        lname: profile?.last_name,
                        audience: profile?.audience,
                        id: profile?.id,
                        image: profile?.avatar_url ? profile?.avatar_url : '',
                        file: ''
                    })
                }
                setProfiles(tempProfiles);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        const init = async () => {
            getAudiences();
            const currentUser = await getUser();
            if (currentUser) {
                getProfiles(currentUser.id);
            }
        };
        init();
    }, []);

    const handleFieldChange = (id, key, value, checked) => {
        if(key === 'audience'){
            let auds = profiles.find(p => p.id === id).audience;
            if(checked)
                auds += "|" + value;
            else
                auds = auds.replace('|' + value, '');
            setProfiles(profiles =>
                profiles.map(profile =>
                    profile?.id === id ? { ...profile, ['audience']: auds } : profile
                )
            )
        }
        else{
            setProfiles(profiles =>
                profiles.map(profile =>
                    profile?.id === id ? { ...profile, [key]: value } : profile
                )
            )
        }
    }

    const addProfile = () => {
        setProfiles([...profiles,
        {
            id: Math.random(),
            fname: '',
            lname: '',
            audience: '',
            isNew: true,
            file: null,
            image: ''
        }
        ])
    }

    const deleteProfile = async (id) => {
        var index = profiles.findIndex(p => p.id === id);
        if(profiles[index].isNew){
            const temp = profiles;
            temp.splice(index, 1);
            setProfiles([...temp]);
        }
        else{
            let result = await fetch(`/api/profiles/${user.id}/${id}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok)
                        return response.json();
                    else
                        return Promise.reject(response);
                })
                .then((result) => {
                    if (result.result === 'error')
                        console.log('error', result);
                    else {
                        const temp = profiles;
                        temp.splice(index, 1);
                        setProfiles([...temp]);
                    }
                    setDeleting(-1);
                })
                .catch((error) => {
                    console.log('error', error);
                    setDeleting(-1);
                })
        }
    }

    const saveProfile = async (id) => {
        setSaving(id);
        const profile = profiles.find(p => p.id === id);

        const formData = new FormData();
        formData.append('profile', JSON.stringify({
            fname: profile?.fname,
            lname: profile?.lname,
            id: profile?.id,
            audience: profile?.audience,
            isNew: profile?.isNew
        }))

        if(profile?.file)
            formData.append('file', profile?.file, profile?.file.name);

        let result = await fetch(`/api/profiles/${user.id}`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok)
                    return response.json();
                else
                    return Promise.reject(response);
            })
            .then((result) => {
                if (result.result === 'error')
                    console.log('error', result);
                else {
                    if(profile?.isNew){
                        handleFieldChange(id, 'id', result.profiles[0].id);
                    }
                    setPersonalizeLiveAttributesCookie({ client_type: profile?.audience });
                    localStorage.setItem('profile', profile?.fname);
                }
                setTimeout(() => {
                    setSaving(-1);
                }, 1000)
            })
            .catch((error) => {
                console.log('error', error);
                setTimeout(() => {
                    setSaving(-1);
                }, 1000)
            })
    }

    const inputStyle = {
        width: '100%',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.12)',
        color: '#1a1a1a',
        padding: '13px 16px',
        fontFamily: 'var(--font-raleway), sans-serif',
        fontWeight: 300,
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    };
    const focusGold = (e) => { e.currentTarget.style.borderColor = '#D1A261'; };
    const blurDefault = (e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; };
    const labelStyle = {
        fontFamily: 'var(--font-montserrat), sans-serif',
        fontWeight: 500,
        fontSize: '0.58rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.45)',
    };

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            <Header locale={params.locale} />

            <div className="max-w-4xl mx-auto px-6 md:px-8" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
                <div className="flex items-center gap-4 mb-4">
                    <span className="w-8 h-px" style={{ background: '#D1A261' }} />
                    <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>
                        Red Panda Resort
                    </span>
                </div>
                <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1.15, color: '#1a1a1a', marginBottom: '3rem' }}>
                    My Profiles
                </h1>

                <div className={`${!authLoading && !user ? "flex" : "hidden"}`}>
                    <div className="w-full text-center" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.6rem', color: '#1a1a1a' }}>
                            You must be logged in.
                        </p>
                    </div>
                </div>

                <div className={`${user ? "" : "hidden"}`}>
                    <div className="flex flex-col gap-y-10">
                        {profiles.map((profile, index) => (
                            <div key={profile?.id} style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                                <div
                                    className="w-full py-4 px-6 items-center flex justify-between"
                                    style={{ background: '#111', borderBottom: '1px solid rgba(209,162,97,0.25)' }}
                                >
                                    <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: '1.2rem', color: '#fff' }}>
                                        {profile?.fname === "" ? (profile?.isNew ? "New Profile" : "Enter Name") : profile?.fname}
                                    </p>
                                    <div className="flex items-center">
                                        {deleting === profile?.id &&
                                            <span style={{ ...labelStyle, color: 'rgba(255,255,255,0.5)', marginRight: '1rem' }}>Are you sure?</span>
                                        }
                                        {deleting === profile?.id &&
                                            <button
                                                onClick={() => deleteProfile(profile?.id)}
                                                style={{ color: '#D1A261' }}
                                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                            >
                                                <FontAwesomeIcon icon={faCheck} className="text-lg" />
                                            </button>
                                        }
                                        {deleting !== profile?.id &&
                                            <button
                                                onClick={() => setDeleting(profile?.id)}
                                                style={{ color: 'rgba(255,255,255,0.5)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#D1A261'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-lg" />
                                            </button>
                                        }
                                    </div>
                                </div>
                                <div
                                    className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 ${saving === profile?.id ? 'opacity-25 pointer-events-none' : ''}`}
                                    style={{ padding: '2rem', transition: 'opacity 0.3s' }}
                                >
                                    <div>
                                        <label htmlFor="fname" style={labelStyle}>First Name*</label>
                                        <div className="mt-2">
                                            <input
                                                name="fname"
                                                id="fname"
                                                value={profile?.fname || ''}
                                                onChange={(e) => handleFieldChange(profile?.id, 'fname', e.target.value)}
                                                onFocus={focusGold}
                                                onBlur={blurDefault}
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-5 md:mt-0">
                                        <label htmlFor="lname" style={labelStyle}>Last Name</label>
                                        <div className="mt-2">
                                            <input
                                                name="lname"
                                                id="lname"
                                                value={profile?.lname || ''}
                                                onChange={(e) => handleFieldChange(profile?.id, 'lname', e.target.value)}
                                                onFocus={focusGold}
                                                onBlur={blurDefault}
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full" style={{ marginTop: '2.5rem', marginBottom: '0.5rem' }}>
                                        <label htmlFor={"upload-image" + profile?.id} className="cursor-pointer" style={{ display: 'inline-block' }}>
                                            {profile?.image !== '' &&
                                                <img
                                                    className="rounded-full"
                                                    style={{ width: '88px', height: '88px', objectFit: 'cover', border: '1px solid rgba(209,162,97,0.4)' }}
                                                    src={profile?.image}
                                                />
                                            }
                                            {profile?.image === '' &&
                                                <FontAwesomeIcon icon={faCircleUser} className="text-8xl" style={{ color: 'rgba(0,0,0,0.2)' }} />
                                            }
                                        </label>
                                        <input
                                            id={"upload-image" + profile?.id}
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={ (e) => {
                                                let selectedFiles = e.target.files;
                                                if (selectedFiles && selectedFiles[0]) {
                                                    let blobUrl = URL.createObjectURL(selectedFiles[0]);
                                                    handleFieldChange(profile?.id, 'image', blobUrl);
                                                    handleFieldChange(profile?.id, 'file', e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-full" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                                        <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>Audiences</p>
                                        <div className="flex flex-wrap gap-2">
                                            {audiences.map((audience, audienceIdx) => {
                                                const checked = profile?.audience?.includes(audience);
                                                return (
                                                    <label
                                                        key={audienceIdx}
                                                        htmlFor={profile?.id + audience}
                                                        className="cursor-pointer"
                                                        style={{
                                                            fontFamily: 'var(--font-montserrat), sans-serif',
                                                            fontSize: '0.6rem',
                                                            letterSpacing: '0.12em',
                                                            textTransform: 'uppercase',
                                                            padding: '7px 14px',
                                                            border: `1px solid ${checked ? '#D1A261' : 'rgba(0,0,0,0.15)'}`,
                                                            background: checked ? '#D1A261' : 'transparent',
                                                            color: checked ? '#000' : 'rgba(0,0,0,0.55)',
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={profile?.id + audience}
                                                            name={"audience" + index}
                                                            value={audience}
                                                            checked={checked}
                                                            onChange={(e) => handleFieldChange(profile?.id, 'audience', e.target.value, e.target.checked)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        {audience}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex justify-end col-span-full">
                                        <button
                                            onClick={() => saveProfile(profile?.id)}
                                            style={{
                                                background: '#D1A261',
                                                color: '#000',
                                                border: 'none',
                                                padding: '13px 32px',
                                                fontFamily: 'var(--font-montserrat), sans-serif',
                                                fontWeight: 600,
                                                fontSize: '0.6rem',
                                                letterSpacing: '0.22em',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => addProfile()}
                            style={{
                                background: 'transparent',
                                color: '#1a1a1a',
                                border: '1px solid rgba(0,0,0,0.2)',
                                padding: '13px 32px',
                                fontFamily: 'var(--font-montserrat), sans-serif',
                                fontWeight: 500,
                                fontSize: '0.6rem',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s, color 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D1A261'; e.currentTarget.style.color = '#D1A261'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.color = '#1a1a1a'; }}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                            Add Profile
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
