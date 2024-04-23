import "./UserInfo.css";
import { IUser } from "../../types/User";

interface UserInfoProps {
  user: IUser;
}

function getFullname(firstName: string, lastName: string | null): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  } else {
    return firstName;
  }
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div>
      <div className="userInfo-block">
        <label className="userInfo-label" htmlFor="user-id">
          Id:
        </label>
        <span id="user-id">{user.id}</span>
      </div>

      <div className="userInfo-block">
        <label className="userInfo-label" htmlFor="user-fullname">
          Fullname:
        </label>
        <span id="user-fullname">
          {getFullname(user.firstName, user.lastName)}
        </span>
      </div>

      <div className="userInfo-block">
        <label className="userInfo-label" htmlFor="user-email">
          Email:
        </label>
        <span id="user-email">{user.email}</span>
      </div>

      <div className="userInfo-block">
        <label className="userInfo-label" htmlFor="user-age">
          Age:
        </label>
        <span id="user-age">{user.age}</span>
      </div>

      <div className="userInfo-block">
        <label className="userInfo-label" htmlFor="user-gender">
          Gender:
        </label>
        <span id="user-gender">{user.gender}</span>
      </div>
    </div>
  );
};

export default UserInfo;
