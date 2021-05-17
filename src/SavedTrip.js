import { Link } from "react-router-dom";

const SavedTrip = ({
  allData,
  form,
  routeData,
  updated,
  isPublic,
  profile,
  togglePrivacy,
  _id,
}) => {
  return (
    <>
      <tr>
        <td>{allData.dataFrom.features[0].properties.name}</td>
        <td>{allData.dataTo.features[0].properties.name}</td>
        <td>{form.buffer} km</td>
        <td>{form.categories.join(", ")}</td>
        <td>{parseInt(form.timeInterval) / 3600} hours</td>
        <td>{new Date(updated).toLocaleDateString()}</td>
        <td>
          <Link
            to={{
              pathname: "/",
              state: {
                isLoaded_p: true,
                allData_p: allData,
                form_p: form,
                routeData_p: routeData,
              },
            }}
          >
            <button>See trip</button>
          </Link>
        </td>
        {profile && (
          <>
            <td>
              {isPublic ? "Public" : "Private"}
              <button
                type="button"
                onClick={() => togglePrivacy(_id, isPublic)}
              >
                Change
              </button>
            </td>
            <td>
              <Link
                to={{
                  pathname: "/",
                  state: {
                    isLoaded_p: true,
                    allData_p: allData,
                    form_p: form,
                    routeData_p: routeData,
                  },
                }}
              >
                <button>Edit</button>
              </Link>
            </td>
            <td>
              <Link
                to={{
                  pathname: "/",
                  state: {
                    isLoaded_p: true,
                    allData_p: allData,
                    form_p: form,
                    routeData_p: routeData,
                  },
                }}
              >
                <button>Delete</button>
              </Link>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

export default SavedTrip;
