import {json, redirect, caughtResponse } from '@remix-run/node';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import { getStoredNotes, storeNotes } from '~/data/notes';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { Link, useLoaderData, useRouteError, isRouteErrorResponse } from '@remix-run/react';

export default function NotesPage() {
    const notes = useLoaderData();

    return (
        <main>
            <NewNote/>
            <NoteList notes={notes}/>
        </main>
    );
}

export async function loader() {
    const notes = await getStoredNotes();
    if (!notes || notes.length === 0) {
        throw json(
            { message: 'Could not find any notes.' }, {
            status: 404,
            statusText: 'Not Found'
            }
        );
    }
    return notes;
}

export function ErrorBoundary(){
    const error = useRouteError();

    // when true, this is what used to go to `CatchBoundary`
    if (isRouteErrorResponse(error)) {
        const message = error.data?.message || 'Data not found.';
        return (
            <main>
                <NewNote />
                <p>{message}</p>
            </main>
        );
    }

    return (
        <main className='error'>
            <h1>An error ocurred!</h1>
            <p>{error.message}</p>
            <p>Back to <Link to="/">safety</Link>!</p>
        </main>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const noteData = Object.fromEntries(formData);

    if (noteData.title.trim().length < 5) {
        return {message: 'Invalid title - must be atleast 5 chatacters long.'};
    }
    const existingNotes = await getStoredNotes();
    noteData.id = new Date().toISOString();
    const updatedNotes = existingNotes.concat(noteData);
    await storeNotes(updatedNotes);
    //await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
    return redirect('/notes');
}

export function links() {
    return [...newNoteLinks(), ...noteListLinks()];
}

export function meta() {
    return {
        title: 'All Notes',
        description: 'A list of all your notes.'
};
}