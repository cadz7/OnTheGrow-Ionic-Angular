for COLLECTION in filters
do
  echo
  echo "# <$COLLECTION>"
  node_modules/koast/server/bin/koast drop --config=mock-server/config --col=$COLLECTION
  node_modules/koast/server/bin/koast load --config=mock-server/config --col=$COLLECTION --src=mock-server/data/$COLLECTION.json
done

