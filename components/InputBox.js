import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import { CameraIcon, VideoCameraIcon } from '@heroicons/react/solid';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadString, uploadBytesResumable } from 'firebase/storage';

export default function InputBox() {
	const { data: session } = useSession();
	const inputRef = useRef(null);
	const filePickerRef = useRef(null);
	const [ imageToPost, setImageToPost ] = useState(null);

	const sendPost = async (e) => {
		e.preventDefault();
		if (!inputRef.current.value) return;

		const docRef = await addDoc(collection(db, 'posts'), {
			message: inputRef.current.value,
			name: session.user.name,
			email: session.user.email,
			image: session.user.image,
			timestamp: serverTimestamp()
		}).then((doc) => {
			if (imageToPost) {
				const storageRef = ref(storage, `posts/${doc.id}`);
				uploadString(storageRef, imageToPost, 'data_url');
				removeImage();

				const uploadTask = uploadBytesResumable(storageRef);
				uploadTask.on(
					'state_changed',
					null,
					(error) => console.error(error),
					() => {
						//  when the upload completes
						storage.ref('posts').child(doc.id).getDownloadURL().then((url) => {
							db.collection('posts').doc(doc.id).set(
								{
									postImage: url
								},
								{ merge: true }
							);
						});
					}
				);
			}
		});

		inputRef.current.value = '';
	};

	const addImageToPost = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
		reader.onload = (readerEvent) => {
			setImageToPost(readerEvent.target.result);
		};
	};

	const removeImage = () => {
		setImageToPost(null);
	};
	return (
		<div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
			<div className="flex space-x-4 p-4 items-center">
				<Image
					className="rounded-full"
					src={session !== undefined ? session.user.image : '/Roxana Copocean Primary.png'}
					width={40}
					height={40}
					layout="fixed"
					alt="Profile Pic"
				/>
				<form action="" className="flex flex-1 ">
					<input
						ref={inputRef}
						type="text"
						placeholder={`What's on your mind, ${session && session.user.name}?`}
						className="rounded-full h-12 bg-gray-200 flex-grow px-5 focus:outline-none"
					/>
					<button hidden type="submit" onClick={sendPost}>
						Submit
					</button>
				</form>
			</div>
			{imageToPost && (
				<div
					onClick={removeImage}
					className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-110 cursor-pointer"
				>
					<img className="h-10 object-contain" src={imageToPost} alt="post" />
					<p className="text-xs text-red-500 text-center">Remove</p>
				</div>
			)}

			<div className="flex justify-evenly p-3 border-t">
				<div className="inputIcon">
					<VideoCameraIcon className="h-7 text-red-500" />
					<p className="text-xs sm:text-sm">Live Video</p>
				</div>
				<div className="inputIcon" onClick={() => filePickerRef.current.click()}>
					<CameraIcon className="h-7 text-green-500" />
					<p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
					<input ref={filePickerRef} type="file" hidden onChange={addImageToPost} />
				</div>
				<div className="inputIcon">
					<EmojiHappyIcon className="h-7 text-yellow-400" />
					<p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
				</div>
			</div>
		</div>
	);
}
