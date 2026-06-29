"use client";
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cslp } from '@/lib/cstack';
import { useRouter } from 'next/navigation';
import { ContentstackClient } from "@/lib/contentstack-client";
import { setPersonalizeLiveAttributesCookie } from '@/lib/cspersonalize';
import { createClient } from '@/utils/supabase/client';
import { faCheck, faCircleUser as loggedIn, faCircleQuestion } from '@awesome.me/kit-610837e1f9/icons/classic/solid';
import { faCircleUser as loggedOut } from '@awesome.me/kit-610837e1f9/icons/classic/thin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon, Squares2X2Icon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useJstag } from '../context/lyticsTracking';
import { useParams } from 'next/navigation';
import { useSlidePanel } from '@/context/slidePanel.context';

// Helper function to delete cookie
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export default function Header({ color, locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entry, setEntry] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const slug = pathname.split('/').slice(2).join('/');
  const jstag = useJstag();
  const params = useParams();
  const { togglePanel } = useSlidePanel();

  const getUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    return user;
  }

  useEffect(() => {
    const init = async () => {
      const user = await getUser();
      if (user) {
        const saved = localStorage.getItem('profile');
        if (saved) {
          setSelectedProfile(saved);
          const foundProfile = profiles?.find(p => p.fname === saved);
          if (foundProfile) {
            setAvatar(foundProfile.avatar);
            setPersonalizeLiveAttributesCookie({ client_type: foundProfile.audience });
          }
        }
      }
    };
    init();
  }, [profiles]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: 'local' });
    deleteCookie('oauth_user');
    deleteCookie('oauth_token');
    deleteCookie('oauth_session');
    localStorage.setItem('profile', "");
    setPersonalizeLiveAttributesCookie({ client_type: "" });
    if (jstag) jstag.clearCookies();
    window.location.reload();
  }

  // Generate random state for CSRF protection
  function generateState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  // Handle OAuth login
  function handleOAuthLogin() {
    // Generate and store state
    const state = generateState();
    sessionStorage.setItem('oauth_state', state);

    // Build OAuth URL
    const authUrl = new URL(process.env.NEXT_PUBLIC_OAUTH_URL);
    authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/oauth/callback`);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');

    // Redirect to OAuth server
    window.location.href = authUrl.toString();
  }

  const getContent = async () => {
    const entry = await ContentstackClient.getElementByTypeWithRefs("header", locale, [
      "menu_items.page",
      "menu_items.sub_items.page",
    ]);
    setEntry(entry?.[0] ?? {});
    setIsLoading(false);
  };

  const getProfiles = async (user_id) => {
    try {
      const response = await fetch(`/api/profiles/${user_id}`, { method: 'GET' });
      if (!response.ok) throw response;
      const result = await response.json();

      const tempProfiles = (result?.profiles ?? []).map(profile => ({
        fname: profile.first_name,
        lname: profile.last_name,
        audience: profile.audience,
        id: profile.id,
        avatar: profile.avatar_url,
      }));
      setProfiles(tempProfiles);

      const saved = localStorage.getItem('profile');
      if (saved) {
        setSelectedProfile(saved);
        const foundProfile = tempProfiles.find(p => p.fname === saved);
        if (foundProfile) {
          setAvatar(foundProfile.avatar);
          setPersonalizeLiveAttributesCookie({ client_type: foundProfile.audience });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const currentUser = await getUser();
      if (currentUser) {
        getProfiles(currentUser.id);
      }
      ContentstackClient.onEntryChange(getContent);
      jstag.call("resetPolling");
    };
    init();
  }, []);

  if (isLoading) return;

  function changeLang(language) {
    const path = language + '/' + slug;
    router.push("/" + path);
  }

  const changeProfile = async (name) => {
    setSelectedProfile(name);

    if (name === "") {
      localStorage.setItem('profile', "");
      setPersonalizeLiveAttributesCookie({ client_type: "" });
    }
    else {
      const profile = profiles.find(p => p.fname === name);
      localStorage.setItem('profile', profile.fname);
      setPersonalizeLiveAttributesCookie({ client_type: profile.audience });
    }
    window.location.reload();
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div
      className={
        " top-0 min-h-20 flex justify-between w-full font-paragraph py-8 px-8 " +
        (color === "white" ? "text-white absolute" : "text-neutral-700")
      }
    >
      <Link href="/" prefetch={false}
        onClick={(e) => {
          // Optional: if you want to ensure the browser does a hard fetch
          window.location.href = "/";
        }} className={"my-auto" +
          (entry?.image_width === "Auto" ? " w-auto" : " w-40")}>
        {color === "white" && (
          <img className="" src={entry?.light_logo?.url} {...entry?.$?.light_logo} />
        )}
        {color !== "white" && (
          <img className="" src={entry?.dark_logo?.url} {...entry?.$?.dark_logo} />
        )}
      </Link>

      <div className="flex lg:hidden items-center gap-3">
        <button
          type="button"
          className={classNames(
            "rp-cart outline-none inline-flex items-center justify-center rounded-full p-1.5 text-current ring-2 ring-inset transition-colors",
            color === "white"
              ? "ring-white hover:bg-white/15"
              : "ring-cyan-600 hover:bg-cyan-600 hover:text-white"
          )}
          aria-label="Shopping cart (embed)"
        >
          <ShoppingBagIcon className="h-6 w-6" aria-hidden />
        </button>
        <button type="button" className="outline-none" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Bars3Icon className="h-8 w-8" />
        </button>
      </div>

      <div className="hidden gap-8 lg:flex " style={{ fontFamily: 'var(--font-raleway), sans-serif', fontSize: '0.82rem', letterSpacing: '0.1em', fontWeight: 400 }} {...entry?.$?.menu_items}>
        {(entry?.menu_items && entry?.menu_items?.length > 0) && (
          entry?.menu_items?.map((item, index) => {
            if (item?.sub_items?.length > 0) {
              return (
                <Popover key={index} className="relative px-5" {...cslp(entry, 'menu_items__', index)}>
                  <div {...item.$?.page}>
                    <PopoverButton className="flex items-center outline-none bg-transparent" {...item.$?.text}>
                      {item?.text}
                      <ChevronDownIcon
                        className="h-5 w-5 flex-none"
                        aria-hidden="true"
                      />
                    </PopoverButton>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel className="absolute top-full right-0 z-10 mt-3 overflow-hidden rounded-lg bg-[#f3f3f9] shadow-lg ">
                      <div className="p-4 text-neutral-700 flex flex-col gap-2" {...item.$?.sub_items}>
                        {(item?.sub_items && item?.sub_items?.length > 0) && (
                          item.sub_items.map((sub, subIdx) => (
                            sub?.page && (
                              <Link
                                key={subIdx}
                                href={sub?.page?.length > 0 ? sub?.page?.[0]?.url : "#"}
                                className="text-nowrap font-light"
                                {...sub.$?.text}
                              >
                                {sub.text}
                              </Link>
                            )
                          )))}
                      </div>
                    </PopoverPanel>
                  </Transition>
                </Popover>
              );
            } else {
              return (
                <div key={index} className="px-5" {...cslp(entry, 'menu_items__', index)} >
                  <div {...item.$?.page}>
                    {item?.page && (
                      <Link
                        href={(item?.page?.length > 0 && item?.page?.[0]?.url) ? item?.page?.[0]?.url : "#"}
                        {...item.$?.text}
                      >
                        {item.text}
                      </Link>
                    )}
                  </div>
                </div>
              );
            }
          }))}
      </div>


      <div className="hidden shrink-0 lg:flex items-center justify-end gap-0">

        <button
          type="button"
          className={classNames(
            "rp-cart outline-none mr-3 inline-flex items-center justify-center rounded-full p-1.5 text-current ring-2 ring-inset transition-colors",
            color === "white"
              ? "ring-white hover:bg-white/15"
              : "ring-cyan-600 hover:bg-cyan-600 hover:text-white"
          )}
          aria-label="Shopping cart (embed)"
        >
          <ShoppingBagIcon className="h-6 w-6" aria-hidden />
        </button>


        <button
          onClick={togglePanel}
          className="outline-none mr-5"
          aria-label="Toggle slide panel"
        >
          <Squares2X2Icon className="h-6 w-6" />
        </button>

        <Link href="/faqs/maldives">

          <FontAwesomeIcon icon={faCircleQuestion} className="mr-5" />
        </Link>

        <div>
          <select
            className="outline-none bg-transparent mr-5"
            value={locale}
            onChange={(e) => {
              changeLang(e.target.value);
            }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
          </select>
        </div>

        {!user &&
          <Popover className="relative">
            <PopoverButton className="outline-none">
              <FontAwesomeIcon icon={loggedOut} className="text-2xl ml-5" />
            </PopoverButton>

            <PopoverPanel anchor="bottom end" className="flex flex-col py-2 px-4 rounded text-neutral-700 bg-[#f3f3f9] shadow-lg">
              <button
                onClick={handleOAuthLogin}
                className="text-nowrap font-light cursor-pointer text-left"
              >
                Log In
              </button>
              <div className="my-1 h-px bg-black/25" />
              <Link href={`/${locale}/orders`} className="font-light text-nowrap">
                MY ORDERS
              </Link>
            </PopoverPanel>
          </Popover>
        }
        {user &&
          <Popover className="relative">
            <PopoverButton className="outline-none">
              {avatar &&
                <img className="w-8 h-8 min-w-8 min-h-8 flex-shrink-0 rounded-full object-cover -mt-1.5" src={avatar} />
              }
              {!avatar &&
                <FontAwesomeIcon icon={loggedIn} className="text-4xl -mt-1.5 " />
              }
            </PopoverButton>

            <PopoverPanel anchor="bottom end" className="flex flex-col py-2 px-4 gap-y-1 bg-[#f3f3f9] rounded-lg mt-2 text-neutral-700 shadow-lg">
              <PopoverButton
                className="group flex w-full items-center font-light"
                onClick={() => changeProfile("")}
              >
                <FontAwesomeIcon icon={faCheck} className={`mr-2 ${!selectedProfile ? "" : "opacity-0"}`} />
                Anonymous
              </PopoverButton>
              {profiles?.map((profile, index) => (
                <PopoverButton key={index}
                  className="group flex w-full items-center font-light"
                  onClick={() => changeProfile(profile.fname)}
                >
                  <FontAwesomeIcon icon={faCheck} className={`mr-2 ${selectedProfile === profile.fname ? "" : "opacity-0"}`} />
                  {profile.fname}
                </PopoverButton>
              ))}
              <div className="my-1 h-px bg-black/25" />
              <Link href="/profiles" className="font-light">MANAGE PROFILES</Link>
              <div className="my-1 h-px bg-black/25" />
              <Link href={`/${locale}/orders`} className="font-light text-nowrap">
                MY ORDERS
              </Link>
              <div className="my-1 h-px bg-black/25" />
              <button
                className="text-nowrap font-light cursor-pointer text-left"
                onClick={handleOAuthLogin}
              >
                SWITCH ACCOUNT
              </button>
              <a
                className="text-nowrap font-light cursor-pointer"
                onClick={logout}
              >
                LOG OUT
              </a>
            </PopoverPanel>
          </Popover>
        }

      </div>

      {mounted && createPortal(
      <div
        className={`fixed top-0 left-0 w-full duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: '#0a0a0a', zIndex: 9999, height: '100dvh' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-7 py-7" style={{ borderBottom: '1px solid rgba(209,162,97,0.15)' }}>
          <div className="flex items-center gap-3">
            <span className="block h-px bg-[#D1A261]" style={{ width: '24px' }} />
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 600 }}>
              Red Panda Resort
            </span>
          </div>
          <button type="button" onClick={() => setMenuOpen(false)} className="outline-none" aria-label="Close menu">
            <XMarkIcon className="h-6 w-6" style={{ color: 'rgba(255,255,255,0.6)' }} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col px-7 pt-10 pb-8 overflow-y-auto" style={{ height: 'calc(100% - 73px)', fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 400, letterSpacing: '0.08em' }}>
          {entry?.menu_items?.map((item, index) => {
            if (item.sub_items?.length > 0) {
              return (
                <Disclosure as="div" key={index + item.text}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className="flex w-full items-center justify-between py-4 outline-none"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: open ? '#D1A261' : 'rgba(255,255,255,0.85)', fontSize: '1.15rem', transition: 'color 0.2s' }}
                      >
                        {item.text}
                        <ChevronDownIcon
                          className={classNames(open ? "rotate-180" : "", "h-4 w-4 flex-none transition-transform duration-200")}
                          style={{ color: '#D1A261' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="pb-2">
                        {item.sub_items.map((subItem, subIdx) => (
                          <Disclosure.Button
                            key={subIdx + subItem?.text}
                            as="a"
                            href={subItem?.page?.[0]?.url ?? "#"}
                            className="block py-2.5 pl-4 outline-none"
                            style={{ fontFamily: 'var(--font-raleway), sans-serif', fontSize: '0.85rem', fontWeight: 300, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          >
                            {subItem?.text}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            } else {
              return (
                <Link
                  key={index}
                  href={(item?.page?.length > 0 && item?.page?.[0]?.url) ? item?.page?.[0]?.url : "#"}
                  className="py-4 block"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D1A261'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                >
                  {item.text}
                </Link>
              );
            }
          })}

          {/* Cart */}
          <button
            type="button"
            className="rp-cart mt-2 pt-4 flex items-center gap-3 outline-none"
            aria-label="Shopping cart"
          >
            <ShoppingBagIcon className="h-5 w-5 shrink-0" style={{ color: '#D1A261' }} aria-hidden />
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }}>Cart</span>
          </button>
        </div>
      </div>
      , document.body)}
    </div>
  );
}
