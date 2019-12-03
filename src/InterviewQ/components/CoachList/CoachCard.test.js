import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import * as rtl from "@testing-library/react";
// import wait from 'waait';

// Import component and query for testing
import CoachCard from './CoachCard';
import { GET_POSTS } from '../CoachList/CoachList';

// gets rid of act() warning when called after render
async function wait(ms = 0) {
    await rtl.act(() => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    });
  } 

// Test React components by mocking calls to the GraphQL endpoint; this allows tests to be run in isolation and removes dependence on remote data
it('coach cards should render without error', async () => {

    const mocks = [
        {
            request: {
                query: GET_POSTS,
            },
            result: {
                data: {
                    posts: [
                        {
                            coach: {
                                first_name: "Ryan",
                                last_name: "Ziegenfus",
                                image_url: "srthggssnrtfgh",
                                city: "Fort Myers",
                                state: "Florida"
                            },
                            price: 12.67,
                            position: "TL",
                            description: "A little bit of this. A little bit of that.",
                            company: "Lambda",
                            industry: {
                                name: "Tech"
                            }
                        }
                    ],
                },
            },
        },
    ];

     rtl.render(
        <MockedProvider mocks={mocks}>
            <CoachCard post={mocks[0].result.data.posts[0]}/>
        </MockedProvider>
    )
    await wait();
});
