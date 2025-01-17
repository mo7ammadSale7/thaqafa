import { Layout } from 'app/layout/layout.types';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string, nameAr: string }[];

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig {
    layout: Layout | string;
    scheme: Scheme | string;
    screens: Screens;
    theme: Theme;
    themes: Themes;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 *
 * "Screens" are carried over to the BreakpointObserver for accessing them within
 * components, and they are required.
 *
 * "Themes" are required for Tailwind to generate themes.
 */
export const appConfig: AppConfig = {
    layout: localStorage.getItem('layout') ? localStorage.getItem('layout') : 'compact',
    scheme: localStorage.getItem('scheme') ? localStorage.getItem('scheme') : 'auto',
    screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1440px'
    },
    theme: localStorage.getItem('theme') ? localStorage.getItem('theme') : 'theme-teal',
    themes: [
        {
            id: 'theme-default',
            name: 'Default',
            nameAr: 'افتراضي'
        },
        {
            id: 'theme-brand',
            name: 'Brand',
            nameAr: 'الماركة'
        },
        {
            id: 'theme-teal',
            name: 'Teal',
            nameAr: 'تيل'
        },
        {
            id: 'theme-rose',
            name: 'Rose',
            nameAr: 'زهري'
        },
        {
            id: 'theme-purple',
            name: 'Purple',
            nameAr: 'بنفسج'
        },
        {
            id: 'theme-amber',
            name: 'Amber',
            nameAr: 'كهرمان'
        }
    ]
};
