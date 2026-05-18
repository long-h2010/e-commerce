'use client';

import { useMemo, useState } from 'react';

export interface Ward {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  wards: Ward[];
}

export interface Province {
  code: string;
  name: string;
  districts: District[];
}

export const useLocation = (rawData: any) => {
  const [provinceCode, setProvinceCode] = useState<string>();
  const [districtCode, setDistrictCode] = useState<string>();
  const [wardCode, setWardCode] = useState<string>();

  const data = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (typeof rawData === 'object')
      return Object.values(rawData).map((p: any) => ({
        ...p,
        districts: Object.values(p.districts || {}).map((d: any) => ({
          ...d,
          wards: Object.values(d.wards || {}),
        })),
      }));
    return [];
  }, [rawData]);

  const provinceMap = useMemo(() => {
    return Object.fromEntries(data.map((p) => [p.code, p]));
  }, [data]);

  const districtMap = useMemo(() => {
    const map: Record<string, District> = {};
    data.forEach((p) =>
      p.districts.forEach((d: District) => {
        map[d.code] = d;
      }),
    );
    return map;
  }, [data]);

  const selectedProvince = provinceCode ? provinceMap[provinceCode] : undefined;

  const districts = selectedProvince?.districts || [];

  const selectedDistrict = districtCode ? districtMap[districtCode] : undefined;

  const wards = selectedDistrict?.wards || [];

  const onChangeProvince = (code: string) => {
    setProvinceCode(code);
    setDistrictCode(undefined);
    setWardCode(undefined);
  };

  const onChangeDistrict = (code: string) => {
    setDistrictCode(code);
    setWardCode(undefined);
  };

  const onChangeWard = (code: string | undefined) => {
    setWardCode(code);
  };

  const provinceOptions = useMemo(
    () =>
      data.map((p) => ({
        label: p.name,
        value: p.name,
        code: p.code,
      })),
    [data],
  );

  const districtOptions = useMemo(
    () =>
      districts.map((d: District) => ({
        label: d.name,
        value: d.name,
        code: d.code,
      })),
    [districts],
  );

  const wardOptions = useMemo(
    () =>
      wards.map((w: Ward) => ({
        label: w.name,
        value: w.name,
        code: w.code,
      })),
    [wards],
  );

  return {
    provinceCode,
    districtCode,
    wardCode,

    selectedProvince,
    selectedDistrict,

    provinces: data,
    districts,
    wards,

    provinceOptions,
    districtOptions,
    wardOptions,

    onChangeProvince,
    onChangeDistrict,
    onChangeWard,
  };
};
