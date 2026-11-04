/**
 * 各功能用到的資料查詢。
 *
 * 舊版的做法：每換一頁就打一次 $top/$skip，另外又為了算總頁數下載整個縣市的資料，
 * 加上地圖又再下載一次 → 一次搜尋 5 個以上請求，很容易 429。
 *
 * 新做法：每個縣市只下載「一次」完整清單 (會被快取)，分頁、關鍵字、距離/方向
 * 篩選都在前端處理，換頁不再發送任何請求。
 */
import { tdxGet } from "./tdx";

const MIN = 60 * 1000;

// $select 只拿畫面用得到的欄位，回應體積小很多
const STATION_FIELDS =
  "StationUID,StationName,StationAddress,StationPosition,UpdateTime";
const AVAILABILITY_FIELDS =
  "StationUID,ServiceStatus,AvailableRentBikes,AvailableReturnBikes,UpdateTime";
const SCENIC_FIELDS =
  "ScenicSpotID,ScenicSpotName,Address,Phone,OpenTime,DescriptionDetail,Picture,Position,City";
const RESTAURANT_FIELDS =
  "RestaurantID,RestaurantName,Address,Phone,OpenTime,Description,Picture,Position,City";

export const PAGE_SIZE = 6;

export function getStations(city) {
  return tdxGet(
    `/api/basic/v2/Bike/Station/City/${city}`,
    { $select: STATION_FIELDS },
    30 * MIN
  );
}

export function getAvailability(city) {
  return tdxGet(
    `/api/basic/v2/Bike/Availability/City/${city}`,
    { $select: AVAILABILITY_FIELDS },
    1 * MIN
  );
}

export function getCyclingShapes(city) {
  return tdxGet(`/api/basic/v2/Cycling/Shape/City/${city}`, {}, 60 * MIN);
}

export function getScenicSpots(city) {
  return tdxGet(
    `/api/basic/v2/Tourism/ScenicSpot/${city}`,
    { $select: SCENIC_FIELDS },
    60 * MIN
  );
}

export function getRestaurants(city) {
  return tdxGet(
    `/api/basic/v2/Tourism/Restaurant/${city}`,
    { $select: RESTAURANT_FIELDS },
    60 * MIN
  );
}

export function getNearbyScenicSpots(city, lat, lng, radius) {
  return tdxGet(
    `/api/basic/v2/Tourism/ScenicSpot/${city}`,
    {
      $select: SCENIC_FIELDS,
      $spatialFilter: `nearby(${lat.toFixed(5)},${lng.toFixed(5)},${radius})`,
    },
    60 * MIN
  );
}

export function getNearbyRestaurants(city, lat, lng, radius) {
  return tdxGet(
    `/api/basic/v2/Tourism/Restaurant/${city}`,
    {
      $select: RESTAURANT_FIELDS,
      $spatialFilter: `nearby(${lat.toFixed(5)},${lng.toFixed(5)},${radius})`,
    },
    60 * MIN
  );
}

/** 以 StationUID 對應站點與即時車輛 (舊版用陣列 index 對應，順序不一致時會顯示錯的數字) */
export function indexAvailability(list) {
  const map = new Map();
  (list || []).forEach((a) => map.set(a.StationUID, a));
  return map;
}

/** 車道進階篩選 (取代原本每次都打 API 的 $filter) */
export const ROAD_FILTERS = {
  1: (r) => r.CyclingLength <= 3000, // 近
  2: (r) => r.CyclingLength > 3000 && r.CyclingLength <= 10000, // 中
  3: (r) => r.CyclingLength > 10000, // 遠
  4: (r) => r.Direction === "雙向",
  5: (r) => r.Direction === "單向",
};

export function paginate(list, page) {
  const start = (page - 1) * PAGE_SIZE;
  return list.slice(start, start + PAGE_SIZE);
}

export function totalPages(list) {
  return Math.max(1, Math.ceil(list.length / PAGE_SIZE));
}
