import { useSelector } from "react-redux";
import { selectProjectDetails } from "../selectors/projects.selectors";
import { diffLines } from "diff";

const CodeHistory = () => {
  const projectDetails = useSelector(selectProjectDetails);

  const codes = [...(projectDetails?.codes || [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const resolveUserName = (userId: number) => {
    if (projectDetails.owner_id === userId) return projectDetails.owner.name;
    return projectDetails.collaborators.find(
      (c: { user_id: number; user: { name: string } }) => c.user_id === userId
    )?.user.name;
  };

  return (
    <div className="min-h-screen text-gray-800 p-6">
      <h2 className="text-blue-500 font-semibold text-lg mb-6">
        Code History – {projectDetails?.name}
      </h2>

      {codes.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500 text-center text-sm">
          No code history available.
        </div>
      ) : (
        <div className="space-y-4">
          {codes.map((entry, index) => {
            const previous = codes[index + 1]?.code_value || "";
            const diffs = diffLines(previous, entry.code_value);

            return (
              <div
                key={entry.id}
                className="bg-white border border-gray-200 p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <div className="text-sm text-gray-600 mb-2">
                  Edited by{" "}
                  <span className="font-medium text-blue-500">
                    {resolveUserName(entry.last_edited_by)}
                  </span>{" "}
                  on {new Date(entry.updatedAt).toLocaleString()}
                </div>

                <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto max-h-64 whitespace-pre-wrap">
                  {diffs.map((part, i) => (
                    <div
                      key={i}
                      className={
                        part.added
                          ? "bg-green-100 text-green-800"
                          : part.removed
                          ? "bg-red-100 text-red-800"
                          : ""
                      }
                    >
                      {part.value}
                    </div>
                  ))}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CodeHistory;
