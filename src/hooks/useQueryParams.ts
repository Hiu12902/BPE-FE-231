import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useQueryParams() {
    const location = useLocation();
    const navigate = useNavigate();

    const setQueryParams = (filters: any) => {
        navigate({
            pathname: location.pathname,
            search: `?${queryString.stringify(filters)}`,
        });
    };

    const queryParams = useMemo(() => {
        const params: any = queryString.parse(location.search);
        return {
            ...params,
            page: Number.parseInt(params.page) || 1,
        };
    }, [location.search]);

    return { queryParams, setQueryParams };
}