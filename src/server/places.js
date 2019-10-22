// import { debounce } from 'debounce'
import webmapApi from './api.webmap'

const search = (sample) => webmapApi.placeSearch(sample)

// const debouncedSearch = debounce(search, 333)

export default function placeSearch (sample) {
  if (!sample || !sample.length || sample.length < 3) {
    return null
  }
  // return debouncedSearch(sample)
  return search(sample)
}
