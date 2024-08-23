/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'لوحة المعلومات',
        subtitle: 'الإحصائيات والمعلومات',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard'
    },
    {
        id: 'students',
        title: 'مسابقة الثقافة',
        subtitle: 'إدارة بيانات مسابقة الثقافة',
        type: 'group',
        icon: 'heroicons_outline:book-open',
        children: [
            {
                id: 'students.list',
                title: 'البيانات الأساسية',
                type: 'basic',
                icon: 'heroicons_outline:document',
                link: '/students'
            }
        ],
    },
    {
        id: 'settings',
        title: 'الإعدادت',
        subtitle: 'التهيئة، المستخدمين ...',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [
            {
                id: 'settings.users',
                title: 'إدارة المستخدمين',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/settings/users'
            }
        ],
    }

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'لوحة المعلومات',
        tooltip: 'لوحة المعلومات',
        type: 'basic',
        icon: 'heroicons_outline:home',
    },
    {
        id: 'students',
        title: 'مسابقة الثقافة',
        tooltip: 'مسابقة الثقافة',
        type: 'aside',
        icon: 'heroicons_outline:book-open',
        children: [],
    },
    {
        id: 'settings',
        title: 'الإعدادت',
        tooltip: 'الإعدادت',
        type: 'aside',
        icon: 'heroicons_outline:cog',
        children: [],
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'لوحة المعلومات',
        type: 'basic',
    },
    {
        id: 'students',
        title: 'مسابقة الثقافة',
        type: 'group',
        children: [],
    },
    {
        id: 'settings',
        title: 'الإعدادت',
        type: 'group',
        children: [],
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'لوحة المعلومات',
        type: 'basic',
        icon: 'heroicons_outline:home',
    },
    {
        id: 'students',
        title: 'مسابقة الثقافة',
        type: 'group',
        icon: 'heroicons_outline:book-open',
        children: [],
    },
    {
        id: 'settings',
        title: 'الإعدادت',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [],
    }
];
