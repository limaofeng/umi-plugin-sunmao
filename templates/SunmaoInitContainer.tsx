import React, { useEffect } from 'react';

import { SunmaoProvider } from 'sunmao';

import { sunmao } from './exports';
import * as libraries from './autoImportLibrary';

type SunmaoInitContainerProps = {
  children: React.ReactNode;
};

function SunmaoInitContainer(props: SunmaoInitContainerProps) {
  const { children } = props;

  useEffect(() => {
    sunmao.addLibrary(...Object.keys(libraries).map(key => libraries[key]));
  }, []);

  return <SunmaoProvider sunmao={sunmao}>{children}</SunmaoProvider>;
}

export default SunmaoInitContainer;
