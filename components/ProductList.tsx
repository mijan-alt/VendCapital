'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SkeletonCard = () => (
  <article className="relative animate-pulse">
    <div className="aspect-square overflow-hidden bg-gray-300"></div>
    <div className="absolute top-0 m-1 rounded-full bg-white">
      <p className="rounded-full bg-gray-300 p-1 text-[10px] font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1"></p>
    </div>
    <div className="mt-4 flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded-md bg-gray-300"></div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-4 w-1/2 rounded-md bg-gray-300"></div>
        <div className="h-4 w-1/4 rounded-md bg-gray-300"></div>
      </div>
    </div>
  </article>
);

const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/fetch-products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Product Listing" description="" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/products/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add products
        </Button>
      </div>
      <section className="">
        <div className="max-w-screen-xl px-4 sm:px-6">
          <div className="mt-10 grid grid-cols-2 gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : products.map((product) => (
                  <article
                    className="relative cursor-pointer"
                    key={product._id}
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        alt=""
                        width={500}
                        height={500}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125"
                        src={product.images[0]}
                      />
                    </div>
                    <div className="absolute top-0 m-1 rounded-full bg-white">
                      <p className="rounded-full bg-black p-1 text-[10px] font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1">
                        Sale
                      </p>
                    </div>
                    <div className="absolute right-0 top-0 m-1 rounded-full bg-white">
                      <p className="rounded-full bg-red-500 p-1 text-[10px] font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1">
                        Edit
                      </p>
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                      <div className="">
                        <h3 className="text-xs font-semibold sm:text-sm md:text-base">
                          <a className="cursor-pointer" href="#" title="">
                            {product.name}
                            <span aria-hidden="true" className="absolute" />
                          </a>
                        </h3>
                        <div className="mt-2 flex items-center">
                          <svg
                            className="block h-3 w-3 align-middle text-black sm:h-4 sm:w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className=""
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                          <svg
                            className="block h-3 w-3 align-middle text-black sm:h-4 sm:w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className=""
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                          <svg
                            className="block h-3 w-3 align-middle text-black sm:h-4 sm:w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className=""
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                          <svg
                            className="block h-3 w-3 align-middle text-black sm:h-4 sm:w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className=""
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                          <svg
                            className="block h-3 w-3 align-middle text-gray-400 sm:h-4 sm:w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className=""
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="mt-px text-xs font-semibold text-gray-600 sm:text-sm">
                          {' '}
                          {product.quantityInStock} in stock{' '}
                        </span>
                        <p className="text-xs font-normal sm:text-sm md:text-base">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductList;
