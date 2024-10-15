import React, { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head, usePage } from '@inertiajs/react';
import UsersTyping from '@/Pages/Chirps/UsersTyping.jsx';

export default function Index({ auth, chirps }) {
  const user = usePage().props.auth.user;
  const [usersTyping, setUsersTyping] = useState({});
  const channelRef = useRef(null);

  if (channelRef.current === null) {
    channelRef.current = Echo.join(`chat`)
      .here((users) => {
        console.log('here users', users);
      })
      .joining((user) => {
        console.log('user joined: ', user.name);
      })
      .leaving((user) => {
        console.log('user left: ', user.name);
      })
      .error((error) => {
        console.error(error);
      })
      .listen('.ChirpCreated', (e) => {
        console.log('chirp created', e);
      })
      .listenForWhisper('typing', (e) => {
        console.log('typing', e.name);

        setUsersTyping((prevState) => ({
          ...prevState,
          [e.id]: {
            id: e.id,
            name: e.name,
          },
        }));
      })
      .listenForWhisper('stoppedTyping', (userId) => {
        setUsersTyping((prevState) => {
          const { [userId]: _, ...rest } = prevState;

          return rest;
        });
      });
  }

  const { data, setData, post, processing, reset, errors } = useForm({
    message: '',
  });

  const submit = (e) => {
    e.preventDefault();

    post(route('chirps.store'), {
      onSuccess: () => reset(),
      headers: {
        'X-Socket-ID': Echo.socketId(),
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Chirps" />

      <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <UsersTyping usersTyping={usersTyping} />

        <form onSubmit={submit}>
          <textarea
            value={data.message}
            placeholder="What's on your mind?"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setData('message', e.target.value)}
            onFocus={() => {
              if (channelRef.current) {
                channelRef.current.whisper('typing', {
                  id: user.id,
                  name: user.name,
                });
              }
            }}
            onBlur={(e) => channelRef.current.whisper('stoppedTyping', user.id)}
          ></textarea>
          <InputError message={errors.message} className="mt-2" />
          <PrimaryButton className="mt-4" disabled={processing}>
            Chirp
          </PrimaryButton>
        </form>

        <div className="shasow-sm rounder-lg mt-6 divide-y bg-white">
          {chirps.map((chirp) => (
            <Chirp key={chirp.id} chirp={chirp} />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
