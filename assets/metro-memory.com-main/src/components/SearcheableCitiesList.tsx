'use client'

import { cities } from '@/lib/citiesConfig'
import { Transition } from '@headlessui/react'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import CityCard from './CityCard'

const SearcheableCitiesList = () => {
  const [search, setSearch] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(cities, {
        keys: ['name'],
        minMatchCharLength: 2,
        threshold: 0.15,
        distance: 10,
      }),
    [],
  )

  const fullCitiesSet = useMemo(
    () => new Set(cities.map((city) => city.link)),
    [],
  )

  const results = useMemo(() => {
    const res = fuse.search(search)
    return search.length > 1
      ? new Set(res.map((result) => result.item.link))
      : fullCitiesSet
  }, [search, fuse, fullCitiesSet])

  return (
    <div className="my-16 mt-16 sm:mt-20">
      <div className="relative mb-4 rounded-md shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-full border-0 px-10 py-4 pr-10 text-lg text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
          type="text"
          placeholder="Search for a city..."
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"
            />
          </svg>
        </div>
      </div>
      <div className="mx-auto grid max-w-full grid-cols-1  gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cities.map((city, i) => (
          <Transition
            as="div"
            enterFrom="opacity-0 translate-y-4"
            enter="transition-all ease-out duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leave="transition-all ease-in duration-200"
            show={results.has(city.link)}
            key={city.link}
          >
            <CityCard
              city={city}
              className={i % 2 ? 'rotate-1' : '-rotate-1'}
            />
          </Transition>
        ))}
      </div>
      {results.size === 0 ? <EmptyState /> : <SuggestCity />}
    </div>
  )
}

const EmptyState = () => {
  return (
    <div className="w-full rounded bg-indigo-700 px-12 py-6 text-white">
      <h3 className="mb-2 text-lg font-medium">No results!</h3>
      <p>
        Want to play in your city? Shoot me a message on 𝕏{' '}
        <a href="https://x.com/_benjamintd">@_benjamintd</a>
      </p>
    </div>
  )
}

const SuggestCity = () => {
  return (
    <p className="mt-6">
      If you want the game to be available in your city, send me a message on 𝕏{' '}
      <a
        className="font-medium hover:underline"
        href="https://twitter.com/_benjamintd"
      >
        @_benjamintd
      </a>
      , or contribute on{' '}
      <a
        className="font-medium hover:underline"
        href="https://github.com/benjamintd/metro-memory.com"
      >
        Github
      </a>
      .
    </p>
  )
}

export default SearcheableCitiesList
