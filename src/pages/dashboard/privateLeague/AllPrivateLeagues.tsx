import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Table from "../../../components/Table";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { PrivateLeagueItem } from "../../../types/types";
import {
	selectAllPrivateLeagues,
	selectIsFetchingAllPrivateLeagues,
	selectShowSharePrivateLeagueModal,
} from "../../../state/slices/privateLeague";
import { getAllPrivateLeaguesAPI } from "../../../api/privateLeagueAPI";
import Button from "../../../components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import PrivateLeagueOptions from "../../../components/PrivateLeagueOptions";
import SharePrivateLeagueModal from "../../../components/modals/SharePrivateLeagueModal";

const AllPrivateLeagues = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [selectedLeague, setSelectedLeague] =
		useState<PrivateLeagueItem | null>(null);

	const allPrivateLeagues = useAppSelector(selectAllPrivateLeagues);
	const showSharePrivateLeagueModal = useAppSelector(
		selectShowSharePrivateLeagueModal
	);
	const isFetchingAllPrivateLeagues = useAppSelector(
		selectIsFetchingAllPrivateLeagues
	);

	const [page, setPage] = useState(1);

	// Get all private leagues
	useMemo(() => {
		dispatch(getAllPrivateLeaguesAPI());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns = useMemo<ColumnDef<PrivateLeagueItem>[]>(
		() => [
			{
				header: "LEAGUES",
				accessorKey: "name",
				cell: (info) => info.getValue(),
				enableSorting: true,
			},
			{
				header: "RANK",
				accessorKey: "username",
				cell: (info) => info.getValue(),
				enableSorting: true,
			},
			{
				header: "ACTIONS",
				accessorKey: "id",
				cell: (info) => {
					return (
						<PrivateLeagueOptions
							setSelectedLeague={setSelectedLeague}
							leagueDetails={info.row.original}
						/>
					);
				},
			},
		],
		[]
	);

	return (
		<DashboardLayout title="Private Leagues">
			<section className="predictbeta-header bg-white w-full px-8 py-4 flex items-end justify-between">
				<h3 className="text-[#212934] font-semibold text-lg">My Leagues</h3>
				<div className="flex items-center gap-x-4">
					<Button
						onClick={() => navigate("/dashboard/private-league/create")}
						title="Create League"
					/>
					<Button.Blue
						onClick={() => navigate("/dashboard/private-league/join")}
						title="Join League"
					/>
				</div>
			</section>
			<section className="w-full md:w-3/4 p-8">
				<Table
					data={allPrivateLeagues}
					columns={columns}
					rows={10}
					loading={isFetchingAllPrivateLeagues}
					totalPages={1}
					current_page={page}
					setCurrentPage={(page: number): void => {
						setPage(page);
						// throw new Error("Function not implemented.");
					}}
					empty_message="No private leagues"
					empty_sub_message="You are not a member of any league. Create one or join one."
				/>
			</section>

			{showSharePrivateLeagueModal ? (
				<SharePrivateLeagueModal leagueDetails={selectedLeague} />
			) : null}
		</DashboardLayout>
	);
};

export default AllPrivateLeagues;
