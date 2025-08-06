import { useSelector } from "react-redux";
import * as selectors from "../selectors";

const ViewCollaboratorsModal = ({ onClose }: { onClose: () => void }) => {
  const projectDetails = useSelector(selectors.selectProjectDetails);

  return (
    <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
        <h2 className="mb-6 text-2xl uppercase text-center font-bold text-blue-500">
          Collaborators
        </h2>

        {projectDetails?.collaborators?.length > 0 ? (
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto space-y-3 pr-1">
            {projectDetails.collaborators.map(
              (col: {
                user_id: number;
                user: { username: string; name: string };
                access_level: string;
              }) => (
                <div
                  key={col.user_id}
                  className="flex justify-between items-center border border-gray-200 px-4 py-3 rounded shadow-sm text-sm text-gray-800"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{col.user.name}</span>
                    <span className="text-xs text-gray-500">
                      @{col.user.username}
                    </span>
                  </div>
                  <div className="uppercase text-blue-600 font-semibold text-xs border border-blue-100 bg-blue-50 px-2 py-1 rounded">
                    {col.access_level}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            No collaborators found
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="hover:bg-gray-100 text-blue-500 text-sm py-2 px-3 rounded border cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCollaboratorsModal;
