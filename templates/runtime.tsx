import React from 'react';

import SunmaoInitContainer from './SunmaoInitContainer';

export const rootContainer = (container: any) => {
  return React.createElement(SunmaoInitContainer as any, {}, container);
};
