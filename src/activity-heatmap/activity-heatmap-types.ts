export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface Contribution {
  date: string;
  count: number;
  level: ContributionLevel;
}

export type HeatmapAccent = 'green' | 'blue' | 'purple' | 'mono' | 'sunset' | 'rose' | 'amber';

export interface TopContributionProject {
  name: string;
  repo?: string;
  commits?: number;
  stars?: number;
  url?: string;
  color?: string;
  bgColor?: string;
  type?: 'flower' | 'matrix' | 'cross' | 'custom';
}

export interface ActivityHeatmapProps {
  theme?: 'dark' | 'light' | 'auto';
  accentColor?: HeatmapAccent;
  customDarkShades?: [string, string, string, string, string];
  customLightShades?: [string, string, string, string, string];
  weeks?: number;
  data?: Contribution[];
  title?: string;
  badgeText?: string;
  badgeBgClass?: string;
  badgeTextClass?: string;
  totalContributions?: number;
  showTooltip?: boolean;
  compact?: boolean;
  footerLabel?: string;
  footerAuthor?: string;
  seed?: number;
  class?: string;
  className?: string;
}

export interface ActivityHeatmapV2Props {
  totalContributions?: number;
  year?: number | string;
  weeks?: number;
  data?: Contribution[];
  accentColor?: HeatmapAccent;
  customDarkShades?: [string, string, string, string, string];
  customLightShades?: [string, string, string, string, string];
  topProjects?: TopContributionProject[];
  topContributionsLabel?: string;
  showTooltip?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  seed?: number;
  class?: string;
  className?: string;
}
