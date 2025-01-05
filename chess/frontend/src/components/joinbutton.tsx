
import { useNavigate } from 'react-router-dom';



// Define the functional component with props type
const JoinButton = () => {

  const navigate  = useNavigate();

  return (
    <div >
      
      
      <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-2 px-4 rounded hover:shadow-2xl mt-4 max-w-60 hover:text-xl "onClick={()=>{navigate("./../game")}}>
        <h1 className='font-bold'>Play Online</h1>
        Play with other players "if any"
      </button>
    </div>
  );
};

export default JoinButton;
