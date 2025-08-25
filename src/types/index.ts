export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
  hasChevron?: boolean;
}

export interface MenuSection {
  title: string;
  icon: string;
  items: MenuColumn[];
}

export interface MenuColumn {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  icon?: string;
  href?: string;
  isFavorite?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  icon?: string;
  href?: string;
}

export interface HeaderButton {
  label: string;
  icon: string;
  variant: 'primary' | 'secondary';
  href?: string;
}