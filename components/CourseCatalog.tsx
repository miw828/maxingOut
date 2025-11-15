import React, { useState, useEffect, useMemo } from 'react';
import type { Course, Review } from '../types';
import { LEHIGH_COLORS, RATING_QUOTES } from '../constants';

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating && setRating(star)}
                    className={`text-3xl transition-colors ${setRating ? 'cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                    aria-label={`Rate ${star} stars`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const AddCourseModal: React.FC<{ onClose: () => void; onAddCourse: (course: Course) => void; }> = ({ onClose, onAddCourse }) => {
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [professor, setProfessor] = useState('');
    const [experience, setExperience] = useState('');
    const [courseLoad, setCourseLoad] = useState('Medium');
    const [hasExam, setHasExam] = useState(true);
    const [isAttendanceMandatory, setIsAttendanceMandatory] = useState(false);
    const [rating, setRating] = useState(3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview: Review = { id: Date.now().toString(), professor, courseLoad, hasExam, isAttendanceMandatory, rating, experience };
        const newCourse: Course = { id: Date.now().toString(), name: courseName, code: courseCode, reviews: [newReview] };
        onAddCourse(newCourse);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl animate-fade-in-up">
                <h2 className="mb-6 text-2xl font-bold" style={{color: LEHIGH_COLORS.brown}}>Add New Course & Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Course Name (e.g., Intro to Psychology)" value={courseName} onChange={e => setCourseName(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Course Code (e.g., PSYC 001)" value={courseCode} onChange={e => setCourseCode(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <hr/>
                    <h3 className="font-semibold text-gray-700">Your First Review</h3>
                    <input type="text" placeholder="Professor" value={professor} onChange={e => setProfessor(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <textarea placeholder="Share your experience..." value={experience} onChange={e => setExperience(e.target.value)} required rows={3} className="w-full p-2 border rounded-md"></textarea>
                    <select value={courseLoad} onChange={e => setCourseLoad(e.target.value)} className="w-full p-2 border rounded-md">
                        <option>Light</option>
                        <option>Medium</option>
                        <option>Heavy</option>
                    </select>
                    <div className="flex justify-around">
                        <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" className="w-4 h-4" checked={hasExam} onChange={e => setHasExam(e.target.checked)} /> Has Exam?</label>
                        <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" className="w-4 h-4" checked={isAttendanceMandatory} onChange={e => setIsAttendanceMandatory(e.target.checked)} /> Attendance Mandatory?</label>
                    </div>
                    <div className="text-center">
                        <label className="block mb-2 font-medium text-gray-700">Overall Rating</label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 font-semibold text-white rounded-md hover:opacity-90" style={{backgroundColor: LEHIGH_COLORS.brown}}>Add Course</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddReviewModal: React.FC<{ courseName: string; onClose: () => void; onAddReview: (review: Review) => void; }> = ({ courseName, onClose, onAddReview }) => {
    const [professor, setProfessor] = useState('');
    const [experience, setExperience] = useState('');
    const [courseLoad, setCourseLoad] = useState('Medium');
    const [hasExam, setHasExam] = useState(true);
    const [isAttendanceMandatory, setIsAttendanceMandatory] = useState(false);
    const [rating, setRating] = useState(3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!professor) {
            alert("Professor name is required.");
            return;
        }
        const newReview: Review = { id: Date.now().toString(), professor, courseLoad, hasExam, isAttendanceMandatory, rating, experience };
        onAddReview(newReview);
        onClose();
    };
    
    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl animate-fade-in-up">
                <h2 className="mb-2 text-2xl font-bold" style={{color: LEHIGH_COLORS.brown}}>Add Your Review</h2>
                <p className="mb-6 text-gray-600">for {courseName}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Professor's Name" value={professor} onChange={e => setProfessor(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <textarea placeholder="Share your experience..." value={experience} onChange={e => setExperience(e.target.value)} required rows={3} className="w-full p-2 border rounded-md"></textarea>
                    <select value={courseLoad} onChange={e => setCourseLoad(e.target.value)} className="w-full p-2 border rounded-md">
                        <option>Light</option>
                        <option>Medium</option>
                        <option>Heavy</option>
                    </select>
                    <div className="flex justify-around">
                        <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" className="w-4 h-4" checked={hasExam} onChange={e => setHasExam(e.target.checked)} /> Has Exam?</label>
                        <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" className="w-4 h-4" checked={isAttendanceMandatory} onChange={e => setIsAttendanceMandatory(e.target.checked)} /> Attendance Mandatory?</label>
                    </div>
                    <div className="text-center">
                        <label className="block mb-2 font-medium text-gray-700">Overall Rating</label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 font-semibold text-white rounded-md hover:opacity-90" style={{backgroundColor: LEHIGH_COLORS.brown}}>Submit Review</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


const CourseCatalog: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filter, setFilter] = useState<'all' | 'easy' | 'hard'>('all');
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [reviewingCourse, setReviewingCourse] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
        setCourses(storedCourses);
    }, []);

    const updateCourses = (newCourses: Course[]) => {
        setCourses(newCourses);
        localStorage.setItem('courses', JSON.stringify(newCourses));
    };

    const handleAddCourse = (course: Course) => {
        updateCourses([...courses, course]);
    };

    const handleAddReview = (newReview: Review) => {
        if (!reviewingCourse) return;
        const updatedCourses = courses.map(c => 
            c.id === reviewingCourse.id 
                ? { ...c, reviews: [...c.reviews, newReview] } 
                : c
        );
        updateCourses(updatedCourses);
        setReviewingCourse(null);
    };

    const getRatingColor = (avgRating: number) => {
        if (avgRating >= 4) return LEHIGH_COLORS.success;
        if (avgRating >= 2.5) return LEHIGH_COLORS.warning;
        return LEHIGH_COLORS.error;
    };

    const filteredCourses = useMemo(() => {
        let sorted = [...courses].sort((a,b) => a.code.localeCompare(b.code));

        if (searchTerm) {
            sorted = sorted.filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filter === 'all') return sorted;
        
        return sorted.filter(course => {
            const avgRating = course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length;
            if (filter === 'easy') return avgRating >= 4;
            if (filter === 'hard') return avgRating < 2.5;
            return true;
        });
    }, [courses, filter, searchTerm]);

    return (
        <div className="max-w-6xl min-h-screen p-4 mx-auto md:p-8">
            {isAddCourseModalOpen && <AddCourseModal onClose={() => setIsAddCourseModalOpen(false)} onAddCourse={handleAddCourse} />}
            {reviewingCourse && <AddReviewModal courseName={reviewingCourse.name} onClose={() => setReviewingCourse(null)} onAddReview={handleAddReview} />}
            
            <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
                <h1 className="text-4xl font-bold" style={{color: LEHIGH_COLORS.brown}}>Course Catalog</h1>
                <button onClick={() => setIsAddCourseModalOpen(true)} className="px-6 py-2 font-semibold text-white transition-all duration-300 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5" style={{backgroundColor: LEHIGH_COLORS.brown}}>+ Add Course</button>
            </div>
            
            <div className="flex flex-col gap-4 p-4 mb-6 bg-white rounded-lg shadow-md md:flex-row md:items-center">
                 <input 
                    type="text" 
                    placeholder="Search by course name or code..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-md md:w-1/3"
                />
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Filter:</span>
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full transition-colors ${filter === 'all' ? 'text-white' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`} style={{backgroundColor: filter === 'all' ? LEHIGH_COLORS.brown : ''}}>All</button>
                    <button onClick={() => setFilter('easy')} className={`px-3 py-1 rounded-full transition-colors ${filter === 'easy' ? 'text-white' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`} style={{backgroundColor: filter === 'easy' ? LEHIGH_COLORS.success : ''}}>Easy (4★+)</button>
                    <button onClick={() => setFilter('hard')} className={`px-3 py-1 rounded-full transition-colors ${filter === 'hard' ? 'text-white' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`} style={{backgroundColor: filter === 'hard' ? LEHIGH_COLORS.error : ''}}>Hard (&lt;2.5★)</button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredCourses.length > 0 ? filteredCourses.map(course => {
                    const avgRating = course.reviews.length ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length : 0;
                    const color = getRatingColor(avgRating);
                    const quote = RATING_QUOTES[Math.round(avgRating) as keyof typeof RATING_QUOTES] || "No reviews yet.";
                    return (
                        <div key={course.id} className="p-5 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1" style={{borderLeft: `5px solid ${color}`}}>
                            <div className="flex flex-col justify-between md:flex-row">
                                <div>
                                    <h2 className="text-xl font-bold" style={{color: LEHIGH_COLORS.brown}}>{course.code}: {course.name}</h2>
                                    <p className="italic text-gray-500">"{quote}"</p>
                                </div>
                                <div className="flex items-center mt-2 md:mt-0">
                                    <span className="mr-2 text-lg font-bold">{avgRating.toFixed(1)}</span>
                                    <StarRating rating={avgRating} />
                                    <span className="ml-2 text-sm text-gray-500">({course.reviews.length} review{course.reviews.length === 1 ? '' : 's'})</span>
                                </div>
                            </div>
                            <div className="mt-4 border-t" style={{borderColor: LEHIGH_COLORS.gray}}>
                                {course.reviews.length > 0 ? course.reviews.map(review => (
                                    <div key={review.id} className="py-3 border-b last:border-b-0" style={{borderColor: LEHIGH_COLORS.gray}}>
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">Prof: {review.professor}</p>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="mt-2 text-gray-700 text-sm">"{review.experience}"</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Load: <b>{review.courseLoad}</b></span>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${review.hasExam ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>Exams: <b>{review.hasExam ? 'Yes' : 'No'}</b></span>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${review.isAttendanceMandatory ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>Attendance: <b>{review.isAttendanceMandatory ? 'Mandatory' : 'Optional'}</b></span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="pt-4 text-sm text-center text-gray-500">No reviews yet for this course.</p>
                                )}
                            </div>
                             <div className="flex justify-end mt-2">
                                <button onClick={() => setReviewingCourse(course)} className="px-3 py-1 text-sm font-semibold rounded-md hover:opacity-80" style={{backgroundColor: LEHIGH_COLORS.gray, color: LEHIGH_COLORS.darkGray}}>
                                    + Add Your Review
                                </button>
                            </div>
                        </div>
                    );
                }) : <p className="p-10 text-center text-gray-500 bg-white rounded-lg shadow-md">No courses found. Be the first to add one!</p>}
            </div>
        </div>
    );
};

export default CourseCatalog;