import { useRouter } from 'next/navigation';// Change import from 'next/navigation' to 'next/router'
import { useState, useEffect } from 'react';

const PostButton = () => { // Changed component name to start with an uppercase letter

  const [Clicked, setClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if( Clicked)
      router.replace("/report");
  }, [Clicked, router]); // Added dependencies array to useEffect

  const handleClicked = ()  => {
    setClicked(true);
  };

  return (
    <div href="/report" className="btn sticky text-[white] top-5 w-[190px] h-[45px] bg-danger rounded-[3px] text-[15px] font-semibold flex items-center justify-center mt-[31px]"
    onClick={() => handleClicked()}
    >
      Post
    </div>
  );
};

export default PostButton; // Changed export to start with an uppercase letter
