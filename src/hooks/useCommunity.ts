import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/userAtom";
import { useNavigate } from "react-router-dom";
import { communitiesAtom } from "../store/communitiesAtom";
import { Community } from "../store/approvedCommunitiesAtom";
import { Roles } from "../constants/roles";
import { mockDatabase } from "../auth/mockDatabase";
import { mockAuth } from "../auth/mockAuth";
import { useCallback } from "react";

const PAGE_SIZE = 10;

export const useCommunity = () => {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const communitiesCache = useRecoilValue(communitiesAtom);
  const setCommunitiesCache = useSetRecoilState(communitiesAtom);

  const navigate = useNavigate();

  const ensureAuth = (): boolean => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const createCommunity = async (title: string, image: string) => {
    if (!ensureAuth()) return;

    const communityId = await mockDatabase.createCommunity({
      title,
      image,
      userId: user!.uid
    });

    // Update user's communities
    await mockAuth.updateUser(user!.uid, {
      communities: [...user!.communities, communityId]
    });

    return communityId;
  };

  const approveCommunity = async (communityId: string) => {
    if (!user || user.role !== Roles.ADMIN) {
      throw new Error("Only admins can approve communities");
    }

    await mockDatabase.approveCommunity(communityId);
  };

  const getApprovedCommunities = useCallback(async (
    lastDoc: any = null
  ) => {
    if (!lastDoc && communitiesCache.length > 0) {
      return { communities: communitiesCache, nextCursor: null };
    }

    const offset = lastDoc ? lastDoc.offset : 0;
    const communities = await mockDatabase.getApprovedCommunities(offset, PAGE_SIZE);

    const nextCursor = communities.length === PAGE_SIZE 
      ? { offset: offset + PAGE_SIZE }
      : null;

    if (!lastDoc) {
      setCommunitiesCache(communities);
    }

    return { communities, nextCursor };
  }, [communitiesCache, setCommunitiesCache]);

  const getCommunityById = async (id: string) => {
    return await mockDatabase.getCommunityById(id);
  };

  const joinCommunity = async (communityId: string) => {
    if (!ensureAuth()) return;

    await Promise.all([
      mockAuth.updateUser(user!.uid, {
        communities: [...user!.communities, communityId]
      }),
      mockDatabase.joinCommunity(communityId)
    ]);

    setUser((prev) =>
      prev ? { ...prev, communities: [...prev.communities, communityId] } : prev
    );
  };

  const leaveCommunity = async (communityId: string) => {
    if (!ensureAuth()) return;

    await Promise.all([
      mockAuth.updateUser(user!.uid, {
        communities: user!.communities.filter(id => id !== communityId)
      }),
      mockDatabase.leaveCommunity(communityId)
    ]);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            communities: prev.communities.filter((id) => id !== communityId),
          }
        : prev
    );
  };

  const getUserCommunities = useCallback(async (): Promise<Community[]> => {
    if (!user) {
      return [];
    }

    const communityIds = user.communities || [];
    const communities = await Promise.all(
      communityIds.map(id => mockDatabase.getCommunityById(id))
    );

    return communities
      .filter(community => community !== null)
      .map(community => community!);
  }, [user]);

  return {
    createCommunity,
    approveCommunity,
    getApprovedCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    getUserCommunities,
  };
};
