import { getDirect } from "./implementation/utils.rest";

const getElevationProfile = (data) => getDirect(`/heightProfile`, data, 'List')

const ServerApiElProfile = {
  getElevationProfile,
}

export default ServerApiElProfile
