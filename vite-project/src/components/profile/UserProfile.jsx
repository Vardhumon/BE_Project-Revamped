import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        console.log(data); // Log the fetched data to the console for debugging purposes
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff9d]"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-gray-400 mt-8">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-24 space-y-8">
      {/* Profile Header */}
      <div className="bg-white/5 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
        <p className="text-gray-400">{profile.bio}</p>
        <p className="text-gray-400 mt-2">Experience Level: {profile.experienceLevel}</p>
      </div>

      {/* Tech Stack */}
      <div className="bg-white/5 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {profile.techStack?.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-[#00ff9d]/10 text-[#00ff9d] rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white/5 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Projects</h2>
        <div className="space-y-4">
          {profile.projects?.map((project, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white">
                {project.projectId?.title || `Project ${index + 1}`}
              </h3>
              {project.repoUrl && (
                <a 
                  href={project.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00ff9d] hover:underline text-sm mt-2 block"
                >
                  Repository Link
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white/5 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
        <p className="text-gray-400">{profile.education}</p>
      </div>

      {/* Hobbies */}
      <div className="bg-white/5 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Hobbies</h2>
        <p className="text-gray-400">{profile.hobbies}</p>
      </div>
    </div>
  );
};

export default UserProfile;