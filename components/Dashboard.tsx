
import React, { useState, useEffect, useCallback } from 'react';
import type { User, Profile, ClubRecommendation } from '../types';
import { AppView } from '../types';
import { MOCK_CLUBS, LEHIGH_COLORS } from '../constants';
import { getClubRecommendations } from '../services/geminiService';

interface DashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigate: (view: AppView) => void;
}

const OnboardingQuiz: React.FC<{ onSubmit: (profile: Profile) => void }> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<Profile>({ hobbies: '', enjoys: '', major: '', minor: '', goals: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="max-w-2xl p-8 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center" style={{color: LEHIGH_COLORS.brown}}>Tell Us About Yourself</h2>
      <p className="mb-6 text-center text-gray-600">Your answers will help us recommend the perfect clubs for you!</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(profile).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium capitalize" style={{color: LEHIGH_COLORS.darkGray}}>{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="text"
              name={key}
              value={profile[key as keyof Profile]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800"
              placeholder={`e.g., ${key === 'major' ? 'Computer Science' : 'Hiking, reading...'}`}
            />
          </div>
        ))}
        <button type="submit" className="w-full py-3 mt-4 font-semibold text-white rounded-md" style={{backgroundColor: LEHIGH_COLORS.brown}}>Find My Clubs</button>
      </form>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [loadingRecs, setLoadingRecs] = useState(false);

  const handleProfileSubmit = async (profile: Profile) => {
    setLoadingRecs(true);
    const recommendations = await getClubRecommendations(profile);
    const updatedUser = { ...user, profile, recommendations };
    onUpdateUser(updatedUser);
    setLoadingRecs(false);
  };

  if (!user.profile) {
    return <OnboardingQuiz onSubmit={handleProfileSubmit} />;
  }

  return (
    <div className="max-w-4xl p-4 mx-auto md:p-8">
      <h1 className="mb-2 text-4xl font-bold" style={{color: LEHIGH_COLORS.brown}}>Welcome, {user.email.split('@')[0]}!</h1>
      <p className="mb-8 text-lg text-gray-600">Here's your personalized dashboard.</p>

      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold" style={{color: LEHIGH_COLORS.brown}}>Your Club Recommendations</h2>
        {loadingRecs ? (
          <div className="text-center">
            <p>Finding the best clubs for you...</p>
            <div className="w-16 h-16 mx-auto mt-4 border-4 border-dashed rounded-full animate-spin" style={{borderColor: LEHIGH_COLORS.lightBrown}}></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {user.recommendations?.map((rec, index) => {
              const club = MOCK_CLUBS.find(c => c.name === rec.clubName);
              return (
                <div key={index} className="flex flex-col p-4 border rounded-lg" style={{borderColor: LEHIGH_COLORS.gray}}>
                  <h3 className="text-lg font-bold" style={{color: LEHIGH_COLORS.brown}}>{rec.clubName}</h3>
                  <p className="mt-2 text-sm text-gray-700 grow">{rec.reason}</p>
                  <p className="mt-2 text-xs italic text-gray-500">{club?.description}</p>
                  <a href="#" className="mt-4 text-sm font-semibold text-center" style={{color: LEHIGH_COLORS.lightBrown}}>
                    Join GroupMe
                    {/* TODO: Add GroupMe link here for each club in constants.ts and render it */}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-semibold" style={{color: LEHIGH_COLORS.brown}}>Course Catalog</h2>
                <p className="mt-2 text-gray-600">Browse courses, read reviews from other students, and plan your semester.</p>
            </div>
            <button onClick={() => onNavigate(AppView.COURSE_CATALOG)} className="w-full py-2 mt-4 font-semibold text-white rounded-md" style={{backgroundColor: LEHIGH_COLORS.brown}}>View Courses</button>
        </div>
        <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-semibold" style={{color: LEHIGH_COLORS.brown}}>Course Site Extension</h2>
                <p className="mt-2 text-gray-600">Find classes that fulfill your major requirements with our smart filter extension.</p>
            </div>
             {/* This button is a placeholder as requested. The code will be added later. */}
            <button className="w-full py-2 mt-4 font-semibold text-white bg-gray-400 rounded-md cursor-not-allowed">Coming Soon</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
