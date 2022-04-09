import defaultSettings from '@/settings'

const title = defaultSettings.title || '校园运动场地管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
