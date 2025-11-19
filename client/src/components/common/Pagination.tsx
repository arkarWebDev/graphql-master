import { updateSearchParams } from "@/lib/helpers";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useNavigate, useSearchParams } from "react-router";

type PaginationProps = {
  totalRoomCount: number;
  perPage: number;
};

function Pagination({ totalRoomCount, perPage }: PaginationProps) {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const clickedPage = (selected + 1).toString();

    searchParams = updateSearchParams(searchParams, "page", clickedPage);
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(url);
  };

  return (
    <main className="pagination">
      <ReactPaginate
        className="mx-auto flex w-full justify-center items-center my-8"
        breakLabel={<Ellipsis />}
        nextLabel={<ChevronRight className=" cursor-pointer" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(totalRoomCount / perPage)}
        previousLabel={<ChevronLeft className=" cursor-pointer" />}
        renderOnZeroPageCount={null}
        initialPage={currentPage > 1 ? currentPage - 1 : undefined}
        disabledClassName="text-gray-400"
        pageClassName="border boder-gray-400 text-gray-400 px-5 py-2 rounded-md  cursor-pointer"
        activeClassName="bg-black text-white border  cursor-pointer"
      />
    </main>
  );
}

export default Pagination;
