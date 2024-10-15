import React from 'react';

const UsersTyping = ({ usersTyping }) => {
  const userIdsTyping = Object.keys(usersTyping);

  if (!userIdsTyping.length) {
    return null;
  }

  return (
    <div className="flex">
      <div className="align-center flex justify-between gap-x-2">
        {userIdsTyping.map((userId, index) => (
          <span
            key={userId}
          >{`${usersTyping[userId].name}${index === userIdsTyping.length - 1 ? '' : ', '}`}</span>
        ))}
      </div>

      <span>&nbsp;typing...</span>
    </div>
  );
};

export default UsersTyping;
