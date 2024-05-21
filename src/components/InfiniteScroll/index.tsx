import dynamic from 'next/dynamic';

const InfiniteScroll: any = dynamic(() => import('react-infinite-scroller'));

export default InfiniteScroll;
