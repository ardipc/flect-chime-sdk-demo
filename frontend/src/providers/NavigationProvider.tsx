// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { useLocation } from 'react-router-dom';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';

import routes from '../constants/routes';

export type NavigationContextType = {
  showNavbar: boolean;
  showRoster: boolean;
  showMetrics: boolean;
  showChatView: boolean;
  toggleRoster: () => void;
  toggleNavbar: () => void;
  toggleChatView: () => void;
  openRoster: () => void;
  closeRoster: () => void;
  openNavbar: () => void;
  closeNavbar: () => void;
  toggleMetrics: () => void;
  openChatView: () => void;
  closeChatView: () => void;
  
};

type Props = {
  children: ReactNode;
};

const NavigationContext = React.createContext<NavigationContextType | null>(
  null
);

const isDesktop = () => window.innerWidth > 768;

const NavigationProvider = ({ children }: Props) => {
  const [showNavbar, setShowNavbar] = useState(() => isDesktop());
  const [showRoster, setShowRoster] = useState(() => isDesktop());
  const [showMetrics, setShowMetrics] = useState(false);
  const [showChatView, setShowChatView] = useState(()=> isDesktop())
  const isDesktopView = useRef(isDesktop());

  const location = useLocation();
  const meetingManager = useMeetingManager();

  useEffect(() => {
    if (location.pathname.includes(routes.MEETING)) {
      return () => { 
        meetingManager.leave();
      }
    }
  }, [location.pathname])

  useEffect(() => {
    const handler = () => {
      const isResizeDesktop = isDesktop();
      if (isDesktopView.current === isResizeDesktop) {
        return;
      }

      isDesktopView.current = isResizeDesktop;

      if (!isResizeDesktop) {
        setShowNavbar(false);
        setShowRoster(false);
        setShowChatView(false)
      } else {
        setShowNavbar(true);
      }
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleRoster = (): void => {
    setShowRoster(!showRoster);
    if(showChatView){
      setShowChatView(false)
    }
  };

  const toggleNavbar = (): void => {
    setShowNavbar(!showNavbar);
  };

  const toggleMetrics = () => {
    setShowMetrics(currentState => !currentState);
  };

  const toggleChatView = () =>{
    setShowChatView(!showChatView)
    if(showRoster){
      setShowRoster(false)
    }
  }

  const openNavbar = (): void => {
    setShowNavbar(true);
  };

  const closeNavbar = (): void => {
    setShowNavbar(false);
  };

  const openRoster = (): void => {
    setShowRoster(true);
  };

  const closeRoster = (): void => {
    setShowRoster(false);
  };
  const openChatView = () =>{
    setShowChatView(true)
  }
  const closeChatView = () =>{
    setShowChatView(false)
  }

  const providerValue = {
    showNavbar,
    showRoster,
    showMetrics,
    showChatView,
    toggleRoster,
    toggleNavbar,
    toggleMetrics,
    toggleChatView,
    openRoster,
    closeRoster,
    openNavbar,
    closeNavbar,
    openChatView,
    closeChatView

  };
  return (
    <NavigationContext.Provider value={providerValue}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw Error('Use useNavigation in NavigationProvider');
  }
  return context;
};

export { NavigationProvider, useNavigation };
