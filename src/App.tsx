import React, { useEffect, useRef, useState } from 'react';
import classes from './App.module.css';

import './App.module.css';
import { log } from 'console';
import Modal from './components/modal/Modal';

type TJoke = {
  setup1: string;
  punchline: string;
}

type AAA = {
  [key: string]: AAA | string;
}

const useFetch = (url: string) => {
  const [data, SetData] = useState<unknown>();
  const [error, SetError] = useState('');
  const [loading, SetLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    SetLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка выполнения запроса");

        return res.json()
      })
      .then(res => {
        SetError('');
        SetData(res);
      })
      .catch(e => SetError(e.message))
      .finally(() => SetLoading(false));

    return () => { controller.abort() }
  }, [url]);

  return { data, error, loading }

}

const useFetch1 = (url: string) => {
  const [joke, setJoke] = useState('');
  // const [adr, setAdr] = useState('');

  useEffect(() => {
    const showJoke = async () => {
      setJoke('идет загрузка...');

      const res = await fetch(url);

      if (!res.ok) {
        setJoke('error ' + res.status);
        return;
      }

      const data = await res.json() as TJoke;
      // console.log(data);

      setJoke(data?.setup1 + '  ' + data.punchline);
    }

    showJoke();
  },
    [url]);



  return [joke];

}

type sss = {
  [key: string]: sss
}

const cns = (s: string) => {
  const a = s.split('.');
  let res: sss = {};
  let rrr: sss = res;
  for (let i = 0; i < a.length; i++) {
    rrr[a[i]] = {};
    rrr = rrr[a[i]];


  }

  return res;
}

const get = (kS: string, nO: AAA) => {
  const mas = kS.split('.');
  let ob = nO;
  for (let i = 0; i < mas.length; i++) {
    if (!ob[mas[i]]) {
      return undefined
    } else {
      if (i === mas.length - 1) {
        return ob[mas[i]]
      }

      if (typeof ob[mas[i]] === 'object') {
        ob = ob[mas[i]] as AAA
      }

    }
  }
}

type Z = 'a' | 'b' | 'c';

type X = {
  [key in Z]: string;
}



let xx: X = { a: 's', b: '1', c: '2' };

// type Y = {
//   [key extends keyof typeof xx] : string;
// }

export function createMap<T>(list: T[]) {

  return function <U>(cb: (a: T) => U): U[] {

    const result = [];

    for (let el of list) {

      result.push(cb(el))

    }

    return result;

  }

}

enum Status {
  OK = 'fulfilled',
  NO = 'rejected'
}

interface I_PA {
  status: Status.OK | Status.NO;
  reason?: Error;
  value?: unknown
}

function PA<T>(mas: Promise<T>[]): Promise<I_PA[]> {
  let result: I_PA[] = [];
  let kol = 0;

  return new Promise((res, rej) => {

    for (let i = 0; i < mas.length; i++) {
      mas[i]
        .then(a => {
          result[i] = { value: a, status: Status.OK };
          kol += 1;
          if (kol === mas.length) res(result);
        })
        .catch(e => {
          result[i] = { value: e, status: Status.NO };
          kol += 1;
          if (kol = mas.length) res(result);
        })
    }
  }
  );
};

function PA_E<T>(mas: Promise<T>[]): Promise<unknown[] | Error> {
  let result: unknown[] = [];
  let kol = 0;

  return new Promise((res, rej) => {
    for (let i = 0; i < mas.length; i++) {
      mas[i]
        .then(a => {
          result[i] = a;
          kol += 1;
          if (kol === mas.length) res(result);
        })
        .catch(e => rej(e))
    }
  })
}

let p1 = new Promise<number>((res, rej) => {
  setTimeout(() => {
    res(6)
  }, 100);
})

let p2 = new Promise((res, rej) => {
  setTimeout(() => {
    rej(new Error('my error'))
  }, 150);
})

let p3 = new Promise((res) => {
  setTimeout(() => {
    res(10)
  }, 200);
})

function getPromise(a: string, ms: number): Promise<string | Error> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      try {
        res(a);
      }
      catch (e) {
        rej(e)
      }
    }, ms)
  })
}



p3 = getPromise('aaa', 100);

PA([p1, p2, p3]).then(a => console.log(a));

PA_E([p1, p2, p3]).then(a => console.log(a)).catch(e => console.log(e));

console.log('-----------------------------------');


myPromiseAll([getPromise('qqqqqqqq', 100), p2, p3]).then(a => console.log(a)).catch(e => console.log(e));

function myPromiseAll<T>(mas: Promise<T>[]): Promise<unknown[] | Error> {
  let result: unknown[] = [];
  let kol = 0;

  return new Promise((res, rej) => {
    for (let i = 0; i < mas.length; i++) {
      mas[i]
        .then(a => {
          result[i] = a;
          kol += 1;
          if (kol === mas.length) {
            res(result)
          }
        })
        .catch(e => rej(e))
    }
  }
  )
}

function parallel(mas: Promise<unknown>[], doneAll: Function) {
  let result: unknown[];
  let kol = 0;

  new Promise((res) => {
    for (let i = 0; i < mas.length; i++) {
      mas[i]
        .then(r => {
          result[i] = r;
          kol += 1;
          if (kol === mas.length) res(result)
        })
        .catch(e => {
          result[i] = 'Error: ' + (e as Error).message;
          kol += 1;
          if (kol === mas.length) res(result)
        })
    }
  })
    .then((data) => doneAll(data));



}

function ppp1(mas: Function[], doneAll: Function) {
  let result: unknown[] = [];
  let kol = 0;

  const done = (ind: number) => (arg: unknown) => {
    result[ind] = arg;
    kol += 1;
    if (kol === mas.length) {
      doneAll(result)
    }
  }

  for (let i = 0; i < mas.length; i++) {
    mas[i](done(i))
  }
}

const fff1 = (done: Function) => {
  setTimeout(() => done('result a'), 300)
}

const fff2 = (done: Function) => {
  setTimeout(() => done('result b'), 200)
}

ppp1([fff1, fff2], (r: unknown[]) => { console.log(r) });

const { 0: a, 1: b } = [1, 2];
console.log(a, '   ', b);




console.log(cns('a.b.c.d'))

console.log(get('red.big.apple.aaa', { red: { big: { apple: 'ab' } } }))



function deb(fn: Function, ms: number) {
  let t: ReturnType<typeof setTimeout>;

  return (...p: any[]) => {
    clearTimeout(t);
    setTimeout(() => { fn(p) }, ms)
  }
}

//структура папок и файлов

type TFold = {
  name: string;
  children?: TFold[]
}

const fold = {
  name: 'folder',
  children: [
    { name: 'file1.txt' },
    { name: 'file2.txt' },
    {
      name: 'images',
      children: [
        { name: 'image.png' },
        {
          name: 'vocation',
          children: [
            { name: 'crocodile.png' },
            { name: 'penguin.png' }
          ]
        },
        {
          name: 'vocation 1',
          children: [
            { name: 'crocodile 1.png' },
            { name: 'penguin 1.png' }
          ]
        }
      ]
    },
    { name: 'shopping-list.pdf' }
  ]
};

const getFold = (a: TFold, s: string) => {
  if (a.children) {
    console.log(s + a.name);
    a.children.forEach(el => getFold(el, s + '   '))
  } else {
    console.log(s + a.name);
  }
}

getFold(fold, '');

type TData = {
  id: number;
  name: string;
  children?: TData[];
}

const dataNode: TData[] = [
  {
    id: 1,
    name: "Node 1",
    children: [{
      id: 2,
      name: "Node 1.1",
      children: [
        {
          id: 3,
          name: "Node 1.1.1",
        }, {
          id: 4,
          name: "Node 1.1.2",
        }
      ]
    },
    {
      id: 5,
      name: "Node 1.2",
      children: [
        {
          id: 6,
          name: "Node 1.2.1",
        }
      ]
    }
    ]
  },
  {
    id: 7,
    name: "Node 2",
    children: [
      {
        id: 8,
        name: "Node 2.1",
      }
    ]
  },
  {
    id: 9,
    name: "Node 3"
  }
];

const getData = (data: TData[]) => {
  return (
    <ul>

      {data.map(el =>
        <li key={el.id}>{el.name}
          {el.children ? getData(el.children) : null}
        </li>
      )
      }

    </ul>
  )
}





//
const makeCounter = () => {
  let count = 0;

  function mc() {
    return ++count;
  }

  mc.set = (value: number) => {
    count = value;
  }

  mc.decrease = () => {
    count--
  }
  return mc;
}

const sum = (a: number) => {
  let itog = a;

  function s(b: number) {
    itog += b;
    return s;
  };

  s.toString = () => {
    return itog;
  }

  return s;
}

const st = () => {
  let start = Date.now();

  setTimeout(function run() {
    let end = Date.now();
    let r = end - start;
    console.log(r + ',');
    if (r > 100) {
      return
    } else {
      setTimeout(run);
    }
  }
  )
}






interface IShowData {
  name: string;
  mass: number;
}

function getPeople(search: string, page = 1, options = {}): any {
  return fetch(`https://swapi.dev/api/people?search=${search}&page=${page}`, options)
    .then(res => res.json())
    .then(data => data)
}

function myDebounce(fn: Function, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    setTimeout(() => {
      fn(args)
    }, ms)
  }
}

const debounceFunc = myDebounce(getPeople, 300);


function App() {
  // const [joke, setJoke] = useState(' ');

  const [data, setData] = useState('');
  const [otvet, setOtvet] = useState<IShowData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const joke = useFetch('');

  const refFirstLoad = useRef(true);

  useEffect(() => {
    const abortController = new AbortController();

    const doSearch = async () => {
      setIsLoading(true);
      try {
        const res = await getPeople(data, 1, { signal: abortController.signal });
        setOtvet(res?.results);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setIsError((e as Error).message)
        }
      } finally {
        setIsLoading(false);
      }
    }

    const debounceSearch = myDebounce(doSearch, 3000);

    if (refFirstLoad.current) {
      refFirstLoad.current = false
    } else {
      debounceSearch(null);
      // doSearch();
    }

    return () => {
      abortController.abort();
    }


  }, [data])

  //

  // useEffect(() => {
  //   let loadOk = true;
  //   let abortController = new AbortController();

  //   const doFetch = (page = 1, options: object = {}) => {
  //     setIsLoading(true);
  //     setIsError('');
  //     setOtvet([]);
  //     console.log('start load');

  //     fetch(`https://swapi.dev/api/people?search=${data}&page=${page}`, options)
  //       .then(res => res.json())
  //       .then((a) => {
  //         if (loadOk) {
  //           setOtvet(a.results)
  //           console.log('set load');
  //         }
  //       })
  //       .catch(e => {
  //         setIsError('Error: ' + (e as Error).message);
  //         setOtvet([]);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //         console.log('final load');
  //       }
  //       )
  //   };

  //   const doFetchA = async (page = 1, options: object = {}) => {
  //     setIsLoading(true);
  //     setIsError('');
  //     try {
  //       let res = await fetch(`https://swapi.dev/api/people?search=${data}&page=${page}`, { ...options, signal: abortController.signal });
  //       let answer = await res.json();
  //       setOtvet(answer.results);
  //     } catch (e) {
  //       setIsError('Error: ' + (e as Error).message);
  //       setOtvet([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (refFirstLoad.current) {
  //     refFirstLoad.current = false;
  //   } else {
  //     doFetchA();
  //   }




  //   return () => {
  //     loadOk = false;
  //     abortController.abort();
  //   }
  // }
  //   , [data]);

  const findData: React.ChangeEventHandler<HTMLInputElement> = (e) => {

    setData(e.target.value);

  }



  // const showJoke = async () => {
  //   setJoke('идет загрузка...')
  //   const res = await fetch('https://official-joke-api.appspot.com/random_joke1');
  //   if (!res.ok) {
  //     setJoke('error ' + res.status);
  //     return;
  //   }

  //   const data = await res.json() as TJoke;
  //   console.log(data);
  //   setJoke(data?.setup1 + '  ' + data.punchline);
  //}



  // console.log('otvet  ', otvet);

  return (
    <>

      <div>
        <input type="text" placeholder='введите...' value={data} onChange={findData} />

      </div>

      {getData(dataNode)}

      {isLoading && 'Загрузка...'}
      {isError && 'Ошибка...' + isError}

      {isLoading || isError || <Spisok mySpisok={otvet} />}


      {/* <div>
        <div>{joke}</div>
        <button onClick={showJoke}> Загрузить шутку </button>
      </div> */}

      {/* <div>
        <input type="text" />

        <label>
          <input type="checkbox" />
          <div className={classes.check}></div>
        </label>

        <input id='111' type="checkbox" />
        <label htmlFor="111"></label>
      </div> */}


    </>

  );
}

console.log('ENV  ', process.env.REACT_APP_VALUE);


function Spisok({ mySpisok }: { mySpisok: IShowData[] }) {
  const [isShow, setIsShow] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    console.log('aaa');
    setIsShow(prev => !prev)
  }



  return (
    <>
      <Modal isShow={isShow} doClose={() => { setIsShow(false) }}> </Modal >
      <ul>
        {mySpisok.map((el, ind) => (
          <li key={ind}>{el.name}</li>
        ))}
      </ul>
      <button onClick={handleClick}>Modal</button>
    </>


  )
}

export default App;
