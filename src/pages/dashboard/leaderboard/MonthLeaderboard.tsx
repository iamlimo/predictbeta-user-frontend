import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import queryString from "query-string";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Table from "../../../components/Table";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { UserPosition } from "../../../types/types";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  selectIsFetchingMonthLeaderboard,
  selectLeaderboard,
} from "../../../state/slices/leaderboard";
import CustomListBox from "../../../components/inputs/CustomListBox";
import { VscFilter } from "react-icons/vsc";
import TabNav from "../../../components/layout/TabNav";
import { createYearRange, monthEnum } from "../../../utils/utils";
import { getMonthLeaderboardAPI } from "../../../api/leaderboardAPI";
import { Input } from "../../../components/inputs/Input";

import AdPopUp from "../../../components/modals/AdPopUp";
import { selectShowAdPopUp, setShowAdPopUp } from "../../../state/slices/auth";

const MonthLeaderboard = () => {
  const dispatch = useAppDispatch();

  const [, setSearchParams] = useSearchParams();
  const l = useLocation();

  const queries = queryString.parse(l.search);
  const query_month = queries?.month;
  const query_year = queries?.year;
  const page = queries?.page;

  const leaderboard = useAppSelector(selectLeaderboard);
  const isFetchingMonthLeaderboard = useAppSelector(
    selectIsFetchingMonthLeaderboard
  );

  const showAdPopUp = useAppSelector(selectShowAdPopUp);

  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(setShowAdPopUp(false));

    return () => {
      dispatch(setShowAdPopUp(false));
    };
  }, []);


  useEffect(() => {
    if (!query_month || !query_year) {
      setSearchParams({
        year: String(query_year ?? new Date().getFullYear()),
        month: String(query_month ?? new Date().getMonth() + 1),
      });
    }
  }, []);

  useEffect(() => {
    if (query_month && query_year) {
      dispatch(
        getMonthLeaderboardAPI({
          params: {
            month: query_month,
            year: query_year,
            limit: 10,
            page,
          },
        })
      );
    } else {
      dispatch(
        getMonthLeaderboardAPI({
          params: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            limit: 10,
            page,
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query_month, page]);

  const columns = useMemo<ColumnDef<UserPosition>[]>(
    () => [
      {
        header: "POSITION",
        accessorKey: "position",
        cell: (info) => info.getValue(),
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "PLAYER NAME",
        accessorKey: "username",
        cell: (info) => {
          const username = String(info.getValue());
          return <p className="capitalize">{username}</p>;
        },
      },
      {
        header: "POINTS",
        accessorKey: "points",
        cell: (info) => Number(info.getValue()).toLocaleString(),
      },
    ],
    []
  );

  // Filter the leaderboard data based on the search query
  const filteredData = useMemo(() => {
    if (!leaderboard?.result?.data) return [];
    return leaderboard.result.data.filter((player) =>
      player.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaderboard, search]);

  return (
    <DashboardLayout title="Month Leaderboard">
      <section className="predictbeta-header bg-white w-full px-4 md:px-8 flex lg:items-end lg:justify-between flex-col-reverse lg:flex-row gap-4 lg:gap-0">
        <TabNav
          tabs={[
            { path: "/dashboard/leaderboard", title: "Week" },
            { path: "/dashboard/leaderboard/month", title: "Month" },
            { path: "/dashboard/leaderboard/season", title: "Season" },
          ]}
        />
        <div className="py-3">
          <Input
            id="search"
            type="text"
            placeholder="Search playername..."
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full md:flex-1`}
          />
        </div>
        <div className="flex items-center gap-4 py-3">
          <CustomListBox
            options={createYearRange(new Date().getFullYear())?.map((year) => ({
              name: year.name,
              value: String(year.value),
            }))}
            onChange={(value: string): void => {
              setSearchParams({
                year: String(value),
                month: String(query_month ?? new Date().getMonth() + 1),
              });
            }}
            defaultOption={String(query_year ?? new Date().getFullYear())}
            title={"Year"}
            icon={<VscFilter />}
          />
          <CustomListBox
            options={monthEnum?.map((month) => ({
              name: month.name,
              value: String(month.value),
            }))}
            onChange={(value: string): void => {
              setSearchParams({
                year: String(query_year ?? new Date().getFullYear()),
                month: String(value),
              });
            }}
            defaultOption={String(query_month || new Date().getMonth() + 1)}
            title={"Month"}
            icon={<VscFilter />}
          />
        </div>
      </section>
      <section className="w-full p-4 md:p-8">
        <div className="pb-5">
          <h1 className="text-2xl font-bold text-[#051B30] py-5 ">
            Your Position this month
          </h1>
          <Table
            data={leaderboard?.userPosition ? [leaderboard.userPosition] : []}
            columns={columns}
            rows={1}
            loading={isFetchingMonthLeaderboard}
            totalPages={1}
            isLeaderboardTable
            current_page={1}
            setCurrentPage={(page: number): void => {
              setSearchParams({
                year: String(query_year ?? new Date().getFullYear()),
                month: String(query_month ?? new Date().getMonth() + 1),
                page: String(page),
              });
            }}
            empty_message="You are not on the leaderboard"
            empty_sub_message="Predict games to get on the leaderboard"
          />
        </div>
        <div className="">
          <h1 className="text-2xl font-bold text-[#051B30] py-5 ">
            This Month's Rankings
          </h1>
          <Table
            data={filteredData}
            columns={columns}
            rows={10}
            loading={isFetchingMonthLeaderboard}
            totalPages={leaderboard?.result?.totalPages ?? 1}
            isLeaderboardTable
            current_page={Number(page ?? 1)}
            setCurrentPage={(page: number): void => {
              setSearchParams({
                year: String(query_year ?? new Date().getFullYear()),
                month: String(query_month ?? new Date().getMonth() + 1),
                page: String(page),
              });
            }}
            empty_message="No leaderboard"
            empty_sub_message="There is no leaderboard for this month"
          />
        </div>
      </section>
      {showAdPopUp ? <AdPopUp /> : null}
    </DashboardLayout>
  );
};

export default MonthLeaderboard;
