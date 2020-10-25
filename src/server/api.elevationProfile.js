import { getDirect } from "./implementation/utils.rest";

const getElevationProfile = (data) => getDirect(`/map/heightProfile`, data, 'List')

const ServerApiElProfile = {
  getElevationProfile,
}

export default ServerApiElProfile
