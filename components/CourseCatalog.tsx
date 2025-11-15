
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
                    className={`text-3xl ${setRating ? 'cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
    const [courseLoad, setCourseLoad] = useState('Medium');
    const [hasExam, setHasExam] = useState(true);
    const [isAttendanceMandatory, setIsAttendanceMandatory] = useState(false);
    const [rating, setRating] = useState(3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview: Review = { id: Date.now().toString(), professor, courseLoad, hasExam, isAttendanceMandatory, rating };
        const newCourse: Course = { id: Date.now().toString(), name: courseName, code: courseCode, reviews: [newReview] };
        onAddCourse(newCourse);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold" style={{color: LEHIGH_COLORS.brown}}>Add New Course & Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Course Name (e.g., Intro to Psychology)" value={courseName} onChange={e => setCourseName(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Course Code (e.g., PSYC 001)" value={courseCode} onChange={e => setCourseCode(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Professor" value={professor} onChange={e => setProfessor(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <select value={courseLoad} onChange={e => setCourseLoad(e.target.value)} className="w-full p-2 border rounded-md">
                        <option>Light</option>
                        <option>Medium</option>
                        <option>Heavy</option>
                    </select>
                    <div className="flex justify-around">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={hasExam} onChange={e => setHasExam(e.target.checked)} /> Has Exam?</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={isAttendanceMandatory} onChange={e => setIsAttendanceMandatory(e.target.checked)} /> Attendance Mandatory?</label>
                    </div>
                    <div className="text-center">
                        <label className="block mb-2 font-medium">Overall Rating</label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white rounded-md" style={{backgroundColor: LEHIGH_COLORS.brown}}>Add Course</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CourseCatalog: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filter, setFilter] = useState<'all' | 'easy' | 'hard'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        <div className="max-w-6xl p-4 mx-auto md:p-8">
            {isModalOpen && <AddCourseModal onClose={() => setIsModalOpen(false)} onAddCourse={handleAddCourse} />}
            <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
                <h1 className="text-4xl font-bold" style={{color: LEHIGH_COLORS.brown}}>Course Catalog</h1>
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 font-semibold text-white rounded-md shadow-lg" style={{backgroundColor: LEHIGH_COLORS.brown}}>+ Add Course</button>
            </div>
            
            <div className="flex flex-col gap-4 p-4 mb-6 bg-white rounded-lg shadow-sm md:flex-row md:items-center">
                 <input 
                    type="text" 
                    placeholder="Search by course name or code..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-md md:w-1/3"
                />
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Filter:</span>
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full ${filter === 'all' ? 'text-white' : ''}`} style={{backgroundColor: filter === 'all' ? LEHIGH_COLORS.brown : LEHIGH_COLORS.gray}}>All</button>
                    <button onClick={() => setFilter('easy')} className={`px-3 py-1 rounded-full ${filter === 'easy' ? 'text-white' : ''}`} style={{backgroundColor: filter === 'easy' ? LEHIGH_COLORS.success : LEHIGH_COLORS.gray}}>Easy (4★+)</button>
                    <button onClick={() => setFilter('hard')} className={`px-3 py-1 rounded-full ${filter === 'hard' ? 'text-white' : ''}`} style={{backgroundColor: filter === 'hard' ? LEHIGH_COLORS.error : LEHIGH_COLORS.gray}}>Hard (&lt;2.5★)</button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredCourses.length > 0 ? filteredCourses.map(course => {
                    const avgRating = course.reviews.length ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length : 0;
                    const color = getRatingColor(avgRating);
                    const quote = RATING_QUOTES[Math.round(avgRating) as keyof typeof RATING_QUOTES] || "No reviews yet.";
                    return (
                        <div key={course.id} className="p-5 bg-white rounded-lg shadow-md" style={{borderLeft: `5px solid ${color}`}}>
                            <div className="flex flex-col justify-between md:flex-row">
                                <div>
                                    <h2 className="text-xl font-bold" style={{color: LEHIGH_COLORS.brown}}>{course.code}: {course.name}</h2>
                                    <p className="italic text-gray-500">"{quote}"</p>
                                </div>
                                <div className="flex items-center mt-2 md:mt-0">
                                    <span className="mr-2 text-lg font-bold">{avgRating.toFixed(1)}</span>
                                    <StarRating rating={avgRating} />
                                    <span className="ml-2 text-sm text-gray-500">({course.reviews.length} reviews)</span>
                                </div>
                            </div>
                            <div className="mt-4 border-t" style={{borderColor: LEHIGH_COLORS.gray}}>
                                {course.reviews.map(review => (
                                    <div key={review.id} className="py-3 border-b" style={{borderColor: LEHIGH_COLORS.gray}}>
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">Prof: {review.professor}</p>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                                            <span>Load: <b>{review.courseLoad}</b></span>
                                            <span>Exams: <b>{review.hasExam ? 'Yes' : 'No'}</b></span>
                                            <span>Attendance: <b>{review.isAttendanceMandatory ? 'Mandatory' : 'Optional'}</b></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }) : <p className="p-10 text-center text-gray-500 bg-white rounded-lg">No courses found. Be the first to add one!</p>}
            </div>
        </div>
    );
};

export default CourseCatalog;
