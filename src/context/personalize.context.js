"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import Personalize from '@contentstack/personalize-edge-sdk';

const PersonalizeContext = createContext(null);

export let sdkInstance = null;

export function PersonalizeProvider({ children }) {
 const [sdk, setSdk] = useState(null);
 useEffect(() => {
   getPersonalizeInstance().then(setSdk);
 }, []);
 return (
   <PersonalizeContext.Provider value={sdk}>
     {!!sdk && children}
   </PersonalizeContext.Provider>
 );
}

export function usePersonalize() {
 return useContext(PersonalizeContext);
}

async function getPersonalizeInstance() {
 if (!Personalize.getInitializationStatus()) {
  sdkInstance = await Personalize.init(process.env.CONTENTSTACK_PERSONALIZATION);
 }
 return sdkInstance;
}