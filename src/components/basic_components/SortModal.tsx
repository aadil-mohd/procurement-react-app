import { useState } from 'react'
import { IFilterDto } from '../../types/commonTypes';

interface SortModalProp {
    filter:IFilterDto
    columns: Record<string, string>
    setFilter: React.Dispatch<React.SetStateAction<IFilterDto>>
    setIsSortModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const SortModal: React.FC<SortModalProp> = ({ columns, setFilter, setIsSortModalOpen,filter }: SortModalProp) => {
    const [sortOptions, setSortOptions] = useState<{ field: string | null; direction: 'ASC' | 'DESC' }>({
        field: filter.sortColumn as string,
        direction: filter.sortOrder as 'ASC' | 'DESC',
    });

    // Handle sort modal submission
    const applySorting = ({ name, order }: { name: string, order: string }) => {
        setFilter(x => ({ ...x, sortColumn: name || "CreatedAt", sortOrder: order }))
        setIsSortModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-600">Sort By</h3>
                <div className="space-y-3">
                    {Object.keys(columns).map((column) => (
                        <button
                            key={column}
                            className="w-full px-4 py-2 text-left text-sm border-b hover:bg-blue-100 text-sm"
                            onClick={() => {
                                let sortingColumn: { name: string, order: 'ASC' | 'DESC' } = { name: column, order: "ASC" };
                                if (sortOptions.field == column) {
                                    sortingColumn.order = sortOptions.direction == 'ASC' ? 'DESC' : 'ASC'
                                    setSortOptions(x => ({ ...x, direction: sortOptions.direction == 'ASC' ? 'DESC' : 'ASC' }))
                                } else {
                                    setSortOptions({ field: column, direction: 'ASC' })
                                }
                                applySorting(sortingColumn);
                            }}
                        >
                            {columns[column]}
                        </button>
                    ))}
                    <div className="mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded text-sm"
                            onClick={() => setIsSortModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SortModal