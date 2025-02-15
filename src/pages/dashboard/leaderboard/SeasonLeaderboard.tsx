import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import queryString from "query-string";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Table from "../../../components/Table";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { UserPosition } from "../../../types/types";
import { getSeasonLeaderboardAPI } from "../../../api/leaderboardAPI";
import {
  selectAllSeasons,
  selectIsFetchingAllSeasons,
} from "../../../state/slices/fixtures";
import { useLocation, useSearchParams } from "react-router-dom";
import { getAllSeasonsAPI } from "../../../api/fixturesAPI";
import {
  selectIsFetchingSeasonLeaderboard,
  selectLeaderboard,
} from "../../../state/slices/leaderboard";
import { Input, InputPlaceholder } from "../../../components/inputs/Input";
import { AiOutlineLoading } from "react-icons/ai";
import CustomListBox from "../../../components/inputs/CustomListBox";
import { VscFilter } from "react-icons/vsc";
import TabNav from "../../../components/layout/TabNav";

import AdPopUp from "../../../components/modals/AdPopUp";
import { selectShowAdPopUp, setShowAdPopUp } from "../../../state/slices/auth";

const SeasonLeaderboard = () => {
  const dispatch = useAppDispatch();

  const [, setSearchParams] = useSearchParams();
  const l = useLocation();

  const queries = queryString.parse(l.search);
  const query_season = queries?.season;
  const page = queries?.page;

  const leaderboard = useAppSelector(selectLeaderboard);
  const isFetchingSeasons = useAppSelector(selectIsFetchingAllSeasons);
  const isFetchingSeasonLeaderboard = useAppSelector(
    selectIsFetchingSeasonLeaderboard
  );
 const showAdPopUp = useAppSelector(selectShowAdPopUp);

  const seasons = useAppSelector(selectAllSeasons);

  const [selectedSeason, setSelectedSeason] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [search, setSearch] = useState("");

  // Get all Season
  useEffect(() => {
    dispatch(getAllSeasonsAPI({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setShowAdPopUp(false));

    return () => {
      dispatch(setShowAdPopUp(false));
    };
  }, []);

  // Make latest season the active week
  useEffect(() => {
    if (query_season) {
      const activeSeason = seasons.find(
        (_season) => _season.name === query_season
      );

      if (activeSeason) {
        setSelectedSeason({
          id: String(selectedSeason?.id),
          name: String(selectedSeason?.name),
        });
      }
    } else {
      setSearchParams({
        season: query_season
          ? String(query_season)
          : String(seasons?.[0]?.name),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasons, query_season]);

  useEffect(() => {
    if (query_season) {
      const activeSeason = seasons.find(
        (_season) => _season.name === query_season
      );
      if (activeSeason?.id) {
        dispatch(
          getSeasonLeaderboardAPI({
            seasonId: activeSeason?.id,
            params: {
              limit: 10,
              page,
            },
          })
        );
      }
    } else if (selectedSeason?.id) {
      dispatch(
        getSeasonLeaderboardAPI({
          seasonId: selectedSeason?.id,
          params: {
            limit: 10,
            page,
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason, page]);

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

  return (
    <DashboardLayout title="Leaderboard">
      <section className="predictbeta-header bg-white w-full px-4 md:px-8 flex lg:items-end lg:justify-between flex-col-reverse lg:flex-row gap-4 lg:gap-0">
        <TabNav
          tabs={[
            { path: "/dashboard/leaderboard", title: "Week" },
            { path: "/dashboard/leaderboard/month", title: "Month" },
            { path: "/dashboard/leaderboard/season", title: "Season" },
          ]}
        />
        <div>
          <Input
            id="search"
            type="text"
            placeholder="Search playername..."
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full md:flex-1`}
          />
        </div>
        {/* season select */}
        <div className="flex items-center gap-4 py-3">
          {isFetchingSeasons || !seasons ? (
            <InputPlaceholder>
              <AiOutlineLoading
                className="animate-spin"
                color="#5D65F6"
                size={16}
              />
            </InputPlaceholder>
          ) : (
            <CustomListBox
              options={seasons?.map((season) => ({
                name: season.name,
                value: String(season.name),
              }))}
              onChange={(value: string): void => {
                setSearchParams({
                  season: String(value),
                  page: String(1),
                });
              }}
              defaultOption={String(query_season)}
              title={"Season"}
              icon={<VscFilter />}
            />
          )}
        </div>
      </section>
      <section className="w-full p-4 md:p-8">
        <div className="pb-5">
          <h1 className="text-2xl font-bold text-[#051B30] py-5 ">
            Your Position this season
          </h1>
          <Table
            data={leaderboard?.userPosition ? [leaderboard.userPosition] : []}
            columns={columns}
            rows={1}
            loading={isFetchingSeasons || isFetchingSeasonLeaderboard}
            totalPages={1}
            isLeaderboardTable
            current_page={1}
            setCurrentPage={(page: number): void => {
              setSearchParams({
                season: String(query_season),
                page: String(page),
              });
            }}
            empty_message="You are not on the leaderboard"
            empty_sub_message="Predict games to get on the leaderboard"
          />
        </div>
        <div className="">
          <h1 className="text-2xl font-bold text-[#051B30] py-5 ">
            This Season's Rankings
          </h1>

          <Table
            data={
              leaderboard?.result?.data?.filter((lead) => {
                return search.toLowerCase() === ""
                  ? lead
                  : lead.username.toLowerCase().includes(search.toLowerCase());
              }) ?? []
            }
            columns={columns}
            rows={10}
            loading={isFetchingSeasons || isFetchingSeasonLeaderboard}
            totalPages={leaderboard?.result?.totalPages ?? 1}
            isLeaderboardTable
            current_page={Number(page ?? 1)}
            setCurrentPage={(page: number): void => {
              setSearchParams({
                season: String(query_season),
                page: String(page),
              });
            }}
            empty_message="No leaderboard"
            empty_sub_message="There is no leaderboard for this season"
          />
        </div>
      </section>
      {showAdPopUp ? <AdPopUp /> : null}
    </DashboardLayout>
  );
};

export default SeasonLeaderboard;
